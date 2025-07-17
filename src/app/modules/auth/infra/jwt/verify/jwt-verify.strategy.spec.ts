import { ConfigService } from '@nestjs/config';
import { UnprocessableEntityException } from '@nestjs/common';
import { JwtVerifyStrategy } from './jwt-verify.strategy';
import { JwtUserPayload } from '@core/user/application/dto/access-token.dto';

describe('JwtVerifyStrategy', () => {
  let jwtVerifyStrategy: JwtVerifyStrategy;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      get: jest.fn().mockReturnValue('test-secret'),
      getOrThrow: jest.fn().mockReturnValue('test-secret'),
    };

    jwtVerifyStrategy = new JwtVerifyStrategy(mockConfigService as ConfigService);
  });

  it('should initialize with correct configuration', () => {
    expect(jwtVerifyStrategy).toBeDefined();
  });

  it('should throw an exception if payload.sub is missing', async () => {
    try {
      const invalidPayload: JwtUserPayload = {
        userId: 'user-id',
      };
      await expect(jwtVerifyStrategy.validate(invalidPayload)).rejects.toThrow(
        UnprocessableEntityException,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException);
    }
  });

  it('should throw an exception if payload.sub is an empty string', async () => {
    try {
      const invalidPayload: JwtUserPayload = { sub: '', userId: '' };
      await expect(jwtVerifyStrategy.validate(invalidPayload)).rejects.toThrow(
        UnprocessableEntityException,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException);
    }
  });

  it('should return the payload if it is valid', () => {
    const validPayload: JwtUserPayload = {
      sub: 'user-id',
      userId: 'user-id',
    };

    const result: JwtUserPayload = jwtVerifyStrategy.validate(validPayload);
    expect(result).toEqual({ sub: 'user-id', userId: 'user-id' });
  });
});
