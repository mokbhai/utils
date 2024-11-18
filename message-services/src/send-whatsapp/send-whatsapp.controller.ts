import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SendWhatsappService } from './send-whatsapp.service';
import { SendWhatsapplDTO } from './dto/post-whatsapp.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe())
@Controller('send-whatsapp')
export class SendWhatsappController {
  constructor(private readonly whatsappService: SendWhatsappService) {}

  @Post()
  async sendWhatsappMessage(
    @Body() data: SendWhatsapplDTO,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.whatsappService.sendMessage(data);
      return { success: true, message: 'WhatsApp message sent successfully' };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send WhatsApp message: ' + error.message,
      };
    }
  }

  @Post('media')
  @UseInterceptors(FileInterceptor('file')) // Use FileInterceptor
  async sendWhatsappMedia(
    @Body() data: SendWhatsapplDTO,
    @UploadedFile() file: Express.Multer.File, // Inject the file
  ): Promise<any> {
    try {
      await this.whatsappService.sendMedia(data, file);
      return { success: true, message: 'WhatsApp media sent successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to send WhatsApp media' };
    }
  }
}
