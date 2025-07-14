import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomJwtModule } from './jwt.module';

describe('CustomJwtModule', () => {
  let module: TestingModule;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    // Create a mock for ConfigService
    configService = Object.assign({} as jest.Mocked<ConfigService>, {
      getOrThrow: jest.fn().mockReturnValue('test-secret'),
    });

    module = await Test.createTestingModule({
      imports: [
        CustomJwtModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ JWT_SECRET: 'test-secret' })],
        }),
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configService)
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide JwtService with correct secret', () => {
    const getOrThrowSpy = jest.spyOn(configService, 'getOrThrow');
    const jwtService = module.get(JwtService);

    expect(jwtService).toBeDefined();
    expect(getOrThrowSpy).toHaveBeenCalledWith('JWT_SECRET');
  });

  it('should provide JwtModule with correct secret', () => {
    const getOrThrowSpy = jest.spyOn(configService, 'getOrThrow');
    const jwtModule = module.get(JwtService);

    expect(jwtModule).toBeDefined();
    expect(getOrThrowSpy).toHaveBeenCalledWith('JWT_SECRET');
  });

  it('should throw an exception if JWT_SECRET is not set', async () => {
    configService.getOrThrow.mockImplementation(() => {
      throw new Error('JWT_SECRET is not set');
    });

    await expect(
      Test.createTestingModule({
        imports: [
          CustomJwtModule,
          ConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({})],
          }),
        ],
      })
        .overrideProvider(ConfigService)
        .useValue(configService)
        .compile(),
    ).rejects.toThrow('JWT_SECRET is not set');
  });
});
