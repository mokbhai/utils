import { Module } from '@nestjs/common';
import { SendMailController } from './send-mail/send-mail.controller';
import { SendMailService } from './send-mail/send-mail.service';
import { SendWhatsappController } from './send-whatsapp/send-whatsapp.controller';
import { SendWhatsappService } from './send-whatsapp/send-whatsapp.service';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [SendMailController, SendWhatsappController, UsersController],
  providers: [SendMailService, SendWhatsappService, UsersService],
})
export class AppModule {}
