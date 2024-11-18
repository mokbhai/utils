import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendWhatsapplDTO {
  @IsNumber()
  countryCode?: number;

  @IsNumber()
  phone?: number;

  @IsString()
  subject?: string;

  @IsNotEmpty()
  @IsString()
  message?: string;
}
