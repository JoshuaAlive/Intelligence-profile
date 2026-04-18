import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExternalService {
  private readonly genderizeUrl = 'https://api.genderize.io';
  private readonly agifyUrl = 'https://api.agify.io';
  private readonly nationalizeUrl = 'https://api.nationalize.io';

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  async fetchGenderData(name: string) {
    try {
      const response = await axios.get(this.genderizeUrl, {
        params: { name },
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'ProfileIntelligenceService/1.0',
        },
      });

      // Check if we have valid data
      if (
        !response.data ||
        !response.data.gender ||
        response.data.count === 0
      ) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Genderize returned an invalid response',
          },
          HttpStatus.BAD_GATEWAY,
        );
      }

      return response.data;
    } catch (error) {
      console.error('Genderize API error:', this.getErrorMessage(error));
      throw new HttpException(
        { status: 'error', message: 'Genderize returned an invalid response' },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async fetchAgeData(name: string) {
    try {
      const response = await axios.get(this.agifyUrl, {
        params: { name },
        timeout: 10000,
        headers: {
          'User-Agent': 'ProfileIntelligenceService/1.0',
        },
      });

      if (!response.data || response.data.age === null) {
        throw new HttpException(
          { status: 'error', message: 'Agify returned an invalid response' },
          HttpStatus.BAD_GATEWAY,
        );
      }

      return response.data;
    } catch (error) {
      console.error('Agify API error:', this.getErrorMessage(error));
      throw new HttpException(
        { status: 'error', message: 'Agify returned an invalid response' },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async fetchNationalityData(name: string) {
    try {
      const response = await axios.get(this.nationalizeUrl, {
        params: { name },
        timeout: 10000,
        headers: {
          'User-Agent': 'ProfileIntelligenceService/1.0',
        },
      });

      if (
        !response.data ||
        !response.data.country ||
        response.data.country.length === 0
      ) {
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
      console.error('Nationalize API error:', this.getErrorMessage(error));
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
