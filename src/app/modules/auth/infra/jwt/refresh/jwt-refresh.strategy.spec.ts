import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtUserPayload } from '@core/user/application/dto/access-token.dto';

describe('JwtRefreshStrategy', () => {
  let jwtRefreshStrategy: JwtRefreshStrategy;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn().mockReturnValue('test-secret'),
    } as unknown as ConfigService;
    jwtRefreshStrategy = new JwtRefreshStrategy(configService);
  });

  it('should be defined', () => {
    expect(jwtRefreshStrategy).toBeDefined();
  });

  it('should return userId if payload is valid', () => {
    const payload: JwtUserPayload = { userId: '456' } as JwtUserPayload;
    expect(jwtRefreshStrategy.validate(payload)).toBe('456');
  });

  it('should throw UnauthorizedException if payload is missing', () => {
    // @ts-expect-error: Testing invalid input
    expect(() => jwtRefreshStrategy.validate(undefined)).toThrow(UnauthorizedException);
  });
});
