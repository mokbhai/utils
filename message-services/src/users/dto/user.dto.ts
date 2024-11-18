import { IsNotEmpty, IsString } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  token: string;

  createdAt: Date;
}
