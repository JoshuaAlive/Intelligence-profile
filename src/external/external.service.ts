import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

export interface GenderizeResponse {
  name: string;
  gender: string | null;
  probability: number;
  count: number;
}

export interface AgifyResponse {
  name: string;
  age: number | null;
  count: number;
}

export interface NationalizeResponse {
  name: string;
  country: Array<{
    country_id: string;
    probability: number;
  }>;
}

@Injectable()
export class ExternalService {
  private readonly genderizeUrl = 'https://api.genderize.io';
  private readonly agifyUrl = 'https://api.agify.io';
  private readonly nationalizeUrl = 'https://api.nationalize.io';

  async fetchGenderData(name: string): Promise<GenderizeResponse> {
    try {
      const response = await axios.get(this.genderizeUrl, {
        params: { name },
        timeout: 5000,
      });

      if (!response.data.gender || response.data.count === 0) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Genderize returned an invalid response',
          },
          HttpStatus.BAD_GATEWAY,
        );
      }

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 502)
        throw error;
      throw new HttpException(
        { status: 'error', message: 'Genderize returned an invalid response' },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async fetchAgeData(name: string): Promise<AgifyResponse> {
    try {
      const response = await axios.get(this.agifyUrl, {
        params: { name },
        timeout: 5000,
      });

      if (response.data.age === null) {
        throw new HttpException(
          { status: 'error', message: 'Agify returned an invalid response' },
          HttpStatus.BAD_GATEWAY,
        );
      }

      return response.data;
    } catch (error) {
      throw new HttpException(
        { status: 'error', message: 'Agify returned an invalid response' },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async fetchNationalityData(name: string): Promise<NationalizeResponse> {
    try {
      const response = await axios.get(this.nationalizeUrl, {
        params: { name },
        timeout: 5000,
      });

      if (!response.data.country || response.data.country.length === 0) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Nationalize returned an invalid response',
          },
          HttpStatus.BAD_GATEWAY,
        );
      }

      return response.data;
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Nationalize returned an invalid response',
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  determineAgeGroup(age: number): string {
    if (age <= 12) return 'child';
    if (age <= 19) return 'teenager';
    if (age <= 59) return 'adult';
    return 'senior';
  }
}
