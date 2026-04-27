import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateLibraryDto {
  @IsString()
  @IsNotEmpty({ message: 'Library name is required' })
  @MinLength(2, { message: 'Library name must be at least 2 characters' })
  name: string;
}
