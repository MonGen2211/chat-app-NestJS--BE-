import { IsNotEmpty, IsString } from 'class-validator';

export default class createStatusDTO {
  @IsNotEmpty()
  @IsString()
  text: string;
}
