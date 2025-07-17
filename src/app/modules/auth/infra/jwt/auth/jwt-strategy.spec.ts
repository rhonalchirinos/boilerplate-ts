import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-strategy';
import { JwtUserPayload } from '@core/user/application/dto/access-token.dto';
import { LoadSessionInteractor } from '@core/user/application/interactors/session/load-session.interactor';
import { Session } from '@core/user/domain/entities/session';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;
  let loadSessionInteractor: LoadSessionInteractor;

  beforeEach(() => {
    configService = {
      getOrThrow: jest.fn().mockReturnValue('test-secret'),
    } as unknown as ConfigService;

    loadSessionInteractor = {
      execute: jest.fn(() => Promise.resolve(undefined)),
    } as unknown as LoadSessionInteractor;

    jwtStrategy = new JwtStrategy(configService, loadSessionInteractor);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should return session when payload is valid', async () => {
    const payload: JwtUserPayload = { userId: 'user1', sub: 'sub1' };
    const session = Session.create({ id: 'sess1', sub: 'sub1', userId: 'user1' });

    const executeSpy = jest.spyOn(loadSessionInteractor, 'execute');
    executeSpy.mockResolvedValue(session);

    const result = await jwtStrategy.validate(payload);
    expect(executeSpy).toHaveBeenCalledWith('sub1');
    expect(result).toBe(session);
  });

  it('should throw UnauthorizedException if payload is missing', async () => {
    await expect(jwtStrategy.validate(null as unknown as JwtUserPayload)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
