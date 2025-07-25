import { IsNotEmpty, IsString } from 'class-validator';
export default class createBlog {
  @IsNotEmpty()
  @IsString()
  header: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  pic_of_blog: string;
}
