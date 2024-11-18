import { IsNotEmpty, IsNumber, IsNumberString, IsString } from 'class-validator';

export class SendWhatsapplDTO {
  @IsNumberString()
  countryCode?: number;

  @IsNumberString()
  phone?: number;

  @IsString()
  subject?: string;

  @IsNotEmpty()
  @IsString()
  message?: string;
}
