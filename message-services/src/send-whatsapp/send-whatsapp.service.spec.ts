import { Test, TestingModule } from '@nestjs/testing';
import { SendWhatsappService } from './send-whatsapp.service';

describe('SendWhatsappService', () => {
  let service: SendWhatsappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendWhatsappService],
    }).compile();

    service = module.get<SendWhatsappService>(SendWhatsappService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
