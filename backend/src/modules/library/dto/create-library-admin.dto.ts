import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateLibraryAdminDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsUUID('4', { message: 'libraryId must be a valid UUID' })
  @IsNotEmpty({ message: 'libraryId is required' })
  libraryId: string;
}
