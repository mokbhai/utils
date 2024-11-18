import { Test, TestingModule } from '@nestjs/testing';
import { SendWhatsappController } from './send-whatsapp.controller';

describe('SendWhatsappController', () => {
  let controller: SendWhatsappController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendWhatsappController],
    }).compile();

    controller = module.get<SendWhatsappController>(SendWhatsappController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
