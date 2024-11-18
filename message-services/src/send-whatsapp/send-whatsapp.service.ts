import { Injectable } from '@nestjs/common';
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
const qrcode = require('qrcode-terminal');
import { SendWhatsapplDTO } from './dto/post-whatsapp.dto';

const automatedMessage = '\n\nPlease note: This is an automated bot message.';

@Injectable()
export class SendWhatsappService {
  private client: Client;

  constructor() {
    console.log('Initializing WhatsApp client...'); 

    this.client = new Client({
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      authStrategy: new LocalAuth(),
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
    });

    this.client.on('qr', (qr) => {
      console.log('QR Code generated:', qr); 
      qrcode.generate(qr, { small: true });
    });

    this.client.on('error', (error) => {
      console.error('WhatsApp client error:', error);
    });

    this.client.initialize();
    console.log('WhatsApp client initialization started...'); 
  }

  async sendMessage(data: SendWhatsapplDTO): Promise<void> {
    try {
      const formattedNumber = data.countryCode + '' + data.phone + '@c.us';
      const message =
        '*' + data.subject + '*\n' + data.message + automatedMessage;
      await this.client.sendMessage(formattedNumber, message);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  async sendMedia(
    data: SendWhatsapplDTO,
    file: Express.Multer.File,
  ): Promise<void> {
    try {
      const media = new MessageMedia(
        file.mimetype,
        file.buffer.toString('base64'),
        file.originalname,
      );
      const formattedNumber = data.countryCode + '' + data.phone + '@c.us';
      await this.client.sendMessage(formattedNumber, media, {
        caption: data.message + automatedMessage,
      });
    } catch (error) {
      console.error('Error sending WhatsApp media:', error);
      throw error;
    }
  }
}
