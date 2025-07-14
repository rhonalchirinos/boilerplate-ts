import { Test, TestingModule } from '@nestjs/testing';
import { CustomDatabaseModule } from './database.module';

describe('CustomDatabaseModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CustomDatabaseModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
