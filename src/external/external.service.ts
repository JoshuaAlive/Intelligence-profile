import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExternalService {
  private readonly genderizeUrl = 'https://api.genderize.io';
  private readonly agifyUrl = 'https://api.agify.io';
  private readonly nationalizeUrl = 'https://api.nationalize.io';
  private readonly requestTimeoutMs = 2500;

  async fetchGenderData(name: string) {
    try {
      const response = await axios.get(this.genderizeUrl, {
        params: { name },
        timeout: this.requestTimeoutMs,
        headers: {
          'User-Agent': 'ProfileIntelligenceService/1.0',
          Accept: 'application/json',
        },
      });

      if (!response.data) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Genderize returned an invalid response',
          },
          HttpStatus.BAD_GATEWAY,
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(`Genderize API error for ${name}:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
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
        timeout: this.requestTimeoutMs,
        headers: {
          'User-Agent': 'ProfileIntelligenceService/1.0',
          Accept: 'application/json',
        },
      });

      if (!response.data) {
        throw new HttpException(
          { status: 'error', message: 'Agify returned an invalid response' },
          HttpStatus.BAD_GATEWAY,
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(`Agify API error for ${name}:`, error.message);
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
        timeout: this.requestTimeoutMs,
        headers: {
          'User-Agent': 'ProfileIntelligenceService/1.0',
          Accept: 'application/json',
        },
      });

      if (!response.data) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Nationalize returned an invalid response',
          },
          HttpStatus.BAD_GATEWAY,
        );
      }

      return response.data;
    } catch (error: any) {
      console.error(`Nationalize API error for ${name}:`, error.message);
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
