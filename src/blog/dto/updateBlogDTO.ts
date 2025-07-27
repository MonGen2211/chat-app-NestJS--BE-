import { IsOptional, IsString } from 'class-validator';

export default class updateBlogDTO {
  @IsOptional()
  @IsString()
  header: string;

  @IsOptional()
  @IsString()
  description: string;
}
