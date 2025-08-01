import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class loginUserDTO {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
