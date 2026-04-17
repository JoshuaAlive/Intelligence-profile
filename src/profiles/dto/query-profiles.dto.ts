import { IsOptional, IsString } from 'class-validator';

export class QueryProfilesDto {
  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  country_id?: string;

  @IsOptional()
  @IsString()
  age_group?: string;
}