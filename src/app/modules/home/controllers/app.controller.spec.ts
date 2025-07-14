import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { HomeModule } from '../home.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HomeModule],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "System is healthy"', () => {
      expect(appController.getHello()).toBe('System is healthy');
    });
  });
});
