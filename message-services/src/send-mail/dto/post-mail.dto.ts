import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SendMailDTO {
  @IsArray()
  to: string[];

  @IsString()
  fromName?: string = 'Mokshit Jain';

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsString()
  text?: string;

  @IsNotEmpty()
  @IsString()
  html: string;
}
