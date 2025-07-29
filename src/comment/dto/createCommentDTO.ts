import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createCommentDTO {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  status_id: string;

  @IsOptional()
  @IsString()
  blog_id: string;
}
