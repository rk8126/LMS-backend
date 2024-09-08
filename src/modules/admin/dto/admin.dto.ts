import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAdminUserDTO {
  @IsNotEmpty()
  @IsString()
  public fullName: string;

  @IsNotEmpty()
  @IsEmail() // Ensures the email is valid
  public email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' }) // Ensures minimum length for password
  public secret: string;

  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  public isSuperAdmin?: boolean;
}
