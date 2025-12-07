import { Test, TestingModule } from '@nestjs/testing';
import { ReadinessController } from './readiness.controller';
import { ReadinessService } from './services/readiness.service';

describe('ReadinessController', () => {
  let controller: ReadinessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadinessController],
      providers: [
        {
          provide: ReadinessService,
          useValue: {
            calculateReadiness: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReadinessController>(ReadinessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
