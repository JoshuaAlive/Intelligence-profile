import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from './entities/profile.entity';
import { ExternalService } from '../external/external.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { QueryProfilesDto } from './dto/query-profiles.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private externalService: ExternalService,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto) {
    const { name } = createProfileDto;
    const normalizedName = name.toLowerCase().trim();

    // Check for existing profile (idempotency)
    const existingProfile = await this.profileRepository.findOne({
      where: { name: normalizedName },
    });

    if (existingProfile) {
      return {
        status: 'success',
        message: 'Profile already exists',
        data: this.formatProfileResponse(existingProfile),
      };
    }

    // Fetch data from external APIs
    try {
      const [genderData, ageData, nationalityData] = await Promise.all([
        this.externalService
          .fetchGenderData(normalizedName)
          .catch(() => ({ gender: 'unknown', probability: 0, count: 0 })),
        this.externalService
          .fetchAgeData(normalizedName)
          .catch(() => ({ age: 0 })),
        this.externalService
          .fetchNationalityData(normalizedName)
          .catch(() => ({ country: [] })),
      ]);

      const countries = Array.isArray(nationalityData.country)
        ? nationalityData.country
        : [];

      // Find country with highest probability, or fall back when nationalize has no candidates.
      const topCountry =
        countries.length > 0
          ? countries.reduce((prev, current) =>
              prev.probability > current.probability ? prev : current,
            )
          : { country_id: 'unknown', probability: 0 };

      const resolvedAge =
        typeof ageData.age === 'number' && ageData.age >= 0 ? ageData.age : 0;
      const resolvedGender =
        typeof genderData.gender === 'string' && genderData.gender.trim()
          ? genderData.gender
          : 'unknown';
      const resolvedGenderProbability =
        typeof genderData.probability === 'number' ? genderData.probability : 0;
      const resolvedSampleSize =
        typeof genderData.count === 'number' ? genderData.count : 0;

      const ageGroup = this.externalService.determineAgeGroup(resolvedAge);

      // Create new profile
      const profile = this.profileRepository.create({
        id: uuidv4(),
        name: normalizedName,
        gender: resolvedGender,
        gender_probability: resolvedGenderProbability,
        sample_size: resolvedSampleSize,
        age: resolvedAge,
        age_group: ageGroup,
        country_id: topCountry.country_id,
        country_probability: topCountry.probability,
        created_at: new Date(),
      });

      const savedProfile = await this.profileRepository.save(profile);

      return {
        status: 'success',
        data: this.formatProfileResponse(savedProfile),
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { status: 'error', message: 'Failed to process profile' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfileById(id: string) {
    const profile = await this.profileRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException({
        status: 'error',
        message: 'Profile not found',
      });
    }

    return {
      status: 'success',
      data: this.formatProfileResponse(profile),
    };
  }

  async getAllProfiles(queryParams: QueryProfilesDto) {
    const query = this.profileRepository.createQueryBuilder('profile');

    if (queryParams.gender) {
      query.andWhere('LOWER(profile.gender) = LOWER(:gender)', {
        gender: queryParams.gender,
      });
    }

    if (queryParams.country_id) {
      query.andWhere('LOWER(profile.country_id) = LOWER(:country_id)', {
        country_id: queryParams.country_id,
      });
    }

    if (queryParams.age_group) {
      query.andWhere('LOWER(profile.age_group) = LOWER(:age_group)', {
        age_group: queryParams.age_group,
      });
    }

    const profiles = await query.getMany();

    return {
      status: 'success',
      count: profiles.length,
      data: profiles.map((profile) => this.formatProfileResponse(profile)),
    };
  }

  async deleteProfile(id: string) {
    const result = await this.profileRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException({
        status: 'error',
        message: 'Profile not found',
      });
    }

    return { status: 'success' };
  }

  private formatProfileResponse(profile: Profile) {
    return {
      id: profile.id,
      name: profile.name,
      gender: profile.gender,
      gender_probability: profile.gender_probability,
      sample_size: profile.sample_size,
      age: profile.age,
      age_group: profile.age_group,
      country_id: profile.country_id,
      country_probability: profile.country_probability,
      created_at: profile.created_at.toISOString(),
    };
  }
}
