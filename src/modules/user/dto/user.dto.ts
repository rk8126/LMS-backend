import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  public fullName: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' }) // Ensures minimum length for password
  public secret: string;
}
