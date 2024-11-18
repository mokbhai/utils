import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDTO } from './dto/post-mail.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendMailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Inject ConfigService
    const mailId = this.configService.get<string>('MAIL_ID');
    const appPassword = this.configService.get<string>('APP_PASSWORD');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: mailId,
        pass: appPassword,
      },
    });
  }

  async sendMail(mailData: SendMailDTO): Promise<void> {
    await this.transporter.sendMail({
      from: `"${mailData.fromName}" <${this.configService.get('MAIL_ID')}>`, // Use configService here as well
      to: mailData.to.join(','),
      subject: mailData.subject,
      text: mailData.text,
      html: mailData.html,
    });
  }

  async sendMedia(
    mailData: SendMailDTO,
    file: Express.Multer.File,
  ): Promise<void> {
    try {
      if (typeof mailData.to === 'string') {
        mailData.to = [mailData.to];
        console.log(mailData.to);
      }
      await this.transporter.sendMail({
        from: `"${mailData.fromName}" <${this.configService.get('MAIL_ID')}>`,
        to: mailData.to.join(','),
        subject: mailData.subject,
        text: mailData.text,
        html: mailData.html,
        attachments: [
          {
            filename: file.originalname,
            content: file.buffer,
            contentType: file.mimetype,
          },
        ],
      });
    } catch (error) {
      console.error('Error sending email with media:', error);
      throw error; // Re-throw for proper error handling
    }
  }
}
