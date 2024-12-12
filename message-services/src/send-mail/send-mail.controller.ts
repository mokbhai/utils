import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { SendMailDTO } from './dto/post-mail.dto';
import { SendMailService } from './send-mail.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('send-mail')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe())
export class SendMailController {
  constructor(private readonly mailService: SendMailService) {}

  @Post()
  async send(@Body() mailData: SendMailDTO) {
    try {
      console.log(mailData);
      await this.mailService.sendMail(mailData);
      return { success: true, message: 'Mail sent successfully' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to send mail' };
    }
  }

  @Post('media')
  @UseInterceptors(FileInterceptor('file'))
  async sendMailWithMedia(
    @Body() mailData: SendMailDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      await this.mailService.sendMedia(mailData, file);
      return { success: true, message: 'Email with media sent successfully' };
    } catch (error) {
      console.error(error); // Log the error for debugging
      return { success: false, message: 'Failed to send email with media' };
    }
  }
}
