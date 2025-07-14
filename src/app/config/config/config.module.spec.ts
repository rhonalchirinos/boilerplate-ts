import { Test, TestingModule } from '@nestjs/testing';
import { CustomConfigModule } from './config.module';
import { ConfigService } from '@nestjs/config';

describe('CustomConfigModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CustomConfigModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide ConfigService', () => {
    const configService = module.get<ConfigService>(ConfigService);
    expect(configService).toBeInstanceOf(ConfigService);
  });
});
