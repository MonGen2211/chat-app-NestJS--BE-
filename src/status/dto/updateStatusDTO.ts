import { IsOptional, IsString } from 'class-validator';
export default class UpdateStatusDTO {
  @IsOptional()
  @IsString()
  text: string;
}
