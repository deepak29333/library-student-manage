import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsInt({ message: 'Seat number must be an integer' })
  @Min(1, { message: 'Seat number must be at least 1' })
  seatNumber: number;

  @IsDateString({}, { message: 'Join date must be a valid date (YYYY-MM-DD)' })
  joinDate: string;
}
