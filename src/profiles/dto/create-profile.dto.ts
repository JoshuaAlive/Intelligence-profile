import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Name must contain only letters and spaces' })
  name!: string;
}