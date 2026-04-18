import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { QueryProfilesDto } from './dto/query-profiles.dto';

@Controller('api/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  getRoot() {
    return {
      status: 'success',
      message: 'Profile Intelligence Service API is running',
      endpoints: {
        create: 'POST /api/profiles',
        list: 'GET /api/profiles',
        get: 'GET /api/profiles/:id',
        delete: 'DELETE /api/profiles/:id',
        filter: 'GET /api/profiles?gender=&country_id=&age_group=',
      },
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @Body(ValidationPipe) createProfileDto: CreateProfileDto,
  ) {
    return this.profilesService.createProfile(createProfileDto);
  }

  @Get(':id')
  async getProfileById(@Param('id') id: string) {
    return this.profilesService.getProfileById(id);
  }

  @Get()
  async getAllProfiles(@Query(ValidationPipe) queryParams: QueryProfilesDto) {
    return this.profilesService.getAllProfiles(queryParams);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(@Param('id') id: string) {
    await this.profilesService.deleteProfile(id);
  }
}
