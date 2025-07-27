import { IsOptional, IsString } from 'class-validator';

export default class getBlogDTO {
  @IsOptional()
  @IsString()
  header: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  user_fullname: string;
}
