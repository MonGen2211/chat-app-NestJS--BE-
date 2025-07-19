import { IsOptional, IsString } from 'class-validator';
export default class MessageDTO {
  @IsOptional()
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  picture: string;
}
