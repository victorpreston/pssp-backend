import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getHealth', () => {
    it('should return health check response', () => {
      const result = appController.getHealth();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('timestamp');
      expect(result.data).toHaveProperty('status');
      expect(result.data).toHaveProperty('service');
      expect(result.data).toHaveProperty('version');
    });
  });
});
