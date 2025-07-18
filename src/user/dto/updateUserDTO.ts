import { IsOptional, IsString } from 'class-validator';

export class updateUserDTO {
  @IsOptional()
  @IsString()
  fullname: string;

  @IsOptional()
  @IsString()
  mobile: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
