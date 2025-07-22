import { GenerateTokenInteractor } from './generate-token.interactor';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { User } from '@core/user/domain/entities/user';
import { Session } from '@core/user/domain/entities/session';
import { TokenDTO } from '@core/user/application/dto/access-token.dto';
import { DeviceRepository } from '@core/user/domain/repositories/device.repository';
import { SessionRepository } from '@core/user/domain/repositories/session.repository';
import { Device } from '@core/user/domain/entities/device';

describe('GenerateTokenInteractor', () => {
  let tokenGenerator: TokenGenerator;
  let deviceRepository: jest.Mocked<DeviceRepository>;
  let sessionRepository: jest.Mocked<SessionRepository>;
  let interactor: GenerateTokenInteractor;

  beforeAll(() => {
    tokenGenerator = {
      token: jest.fn(),
      refreshToken: jest.fn(),
    } as unknown as TokenGenerator;

    deviceRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByDevice: jest.fn(),
      findByUserIdAndDevice: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<DeviceRepository>;

    sessionRepository = {
      findById: jest.fn(),
      findBySub: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<SessionRepository>;

    interactor = new GenerateTokenInteractor(tokenGenerator, deviceRepository, sessionRepository);
  });

  beforeEach(() => jest.clearAllMocks());

  it('should generate session and tokens', async () => {
    jest.clearAllMocks();
    const userId = 'user-1';
    const token: TokenDTO = { token: 'access-token', sub: 'sub-1', expiresAt: new Date() };
    const refreshToken: TokenDTO = { token: 'refresh-token', sub: 'sub-2', expiresAt: new Date() };
    const deviceArgs = {
      ip: '127.0.0.1',
      platform: 'MacBook',
      browser: 'macOS',
      osVersion: '14.0',
      userAgent: 'Mozilla/5.0 Chrome/87.0.4280.88 Safari/537.36',
    };

    jest.spyOn(tokenGenerator, 'token').mockResolvedValue(token);
    jest.spyOn(tokenGenerator, 'refreshToken').mockResolvedValue(refreshToken);
    jest.spyOn(deviceRepository, 'findByDevice').mockResolvedValue(null);

    const saveDeviceSpy = jest.spyOn(deviceRepository, 'save').mockResolvedValue(
      Device.create({
        id: 'device-1',
        userId,
        ...deviceArgs,
      }),
    );

    const saveSessionSpy = jest.spyOn(sessionRepository, 'save').mockResolvedValue(
      Session.create({
        sub: token.sub,
        userId,
        refresh: refreshToken.sub,
        expiresAt: token.expiresAt!,
        deviceId: 'device-1',
      }),
    );

    const result = await interactor.generateSession(userId, deviceArgs);
    expect(result.token).toEqual(token);
    expect(result.refresh).toEqual(refreshToken);
    expect(result.session).toBeInstanceOf(Session);
    expect(result.session.getUserId()).toBe(userId);
    expect(result.session.getRefresh()).toBe(refreshToken.sub);
    expect(result.session.getExpiresAt()).toBe(token.expiresAt);
    expect(saveDeviceSpy).toHaveBeenCalledWith({
      userId,
      ...deviceArgs,
      id: undefined,
      createdAt: expect.any(Date) as Date, // Assuming userAgent is a Date in the Device entity
    });
    expect(saveSessionSpy).toHaveBeenCalledWith({
      id: undefined,
      sub: token.sub,
      userId,
      refresh: refreshToken.sub,
      expiresAt: token.expiresAt!,
      deviceId: 'device-1',
      createdAt: expect.any(Date) as Date, // Assuming userAgent is a Date in the Device entity
    });
  });

  it('should use existing device if found', async () => {
    const userId = 'user-2';
    const token: TokenDTO = { token: 'access-token-2', sub: 'sub-2', expiresAt: new Date() };
    const refreshToken: TokenDTO = {
      token: 'refresh-token-2',
      sub: 'sub-3',
      expiresAt: new Date(),
    };
    const deviceArgs = {
      ip: '192.168.1.1',
      platform: 'Windows',
      browser: 'Edge',
      osVersion: '11',
      userAgent: 'Mozilla/5.0 Edge/90.0.818.49',
    };
    const existingDevice = Device.create({ id: 'device-2', userId, ...deviceArgs });
    const saveDeviceSpy = jest.spyOn(deviceRepository, 'save');

    jest.spyOn(tokenGenerator, 'token').mockResolvedValue(token);
    jest.spyOn(tokenGenerator, 'refreshToken').mockResolvedValue(refreshToken);
    jest.spyOn(deviceRepository, 'findByDevice').mockResolvedValue(existingDevice);
    jest.spyOn(sessionRepository, 'save').mockResolvedValue(
      Session.create({
        sub: token.sub,
        userId,
        refresh: refreshToken.sub,
        expiresAt: token.expiresAt!,
        deviceId: 'device-2',
      }),
    );
    const result = await interactor.generateSession(userId, deviceArgs);

    expect(result.token).toEqual(token);
    expect(result.refresh).toEqual(refreshToken);
    expect(result.session.getUserId()).toBe(userId);
    expect(saveDeviceSpy).not.toHaveBeenCalled();
  });

  it('should throw if tokenGenerator.token fails', async () => {
    jest.spyOn(tokenGenerator, 'token').mockRejectedValue(new Error('Token error'));
    const deviceArgs = { userAgent: 'UA' };
    await expect(interactor.generateSession('user-err', deviceArgs)).rejects.toThrow('Token error');
  });

  it('should throw if tokenGenerator.refreshToken fails', async () => {
    jest
      .spyOn(tokenGenerator, 'token')
      .mockResolvedValue({ token: 't', sub: 's', expiresAt: new Date() });
    jest.spyOn(tokenGenerator, 'refreshToken').mockRejectedValue(new Error('Refresh error'));
    const deviceArgs = { userAgent: 'UA' };
    await expect(interactor.generateSession('user-err2', deviceArgs)).rejects.toThrow(
      'Refresh error',
    );
  });

  it('should throw if deviceRepository.save fails', async () => {
    jest
      .spyOn(tokenGenerator, 'token')
      .mockResolvedValue({ token: 't', sub: 's', expiresAt: new Date() });
    jest
      .spyOn(tokenGenerator, 'refreshToken')
      .mockResolvedValue({ token: 'r', sub: 'rs', expiresAt: new Date() });
    jest.spyOn(deviceRepository, 'findByDevice').mockResolvedValue(null);
    jest.spyOn(deviceRepository, 'save').mockRejectedValue(new Error('Device save error'));
    const deviceArgs = { userAgent: 'UA' };
    await expect(interactor.generateSession('user-err3', deviceArgs)).rejects.toThrow(
      'Device save error',
    );
  });

  it('should throw if sessionRepository.save fails', async () => {
    jest
      .spyOn(tokenGenerator, 'token')
      .mockResolvedValue({ token: 't', sub: 's', expiresAt: new Date() });
    jest
      .spyOn(tokenGenerator, 'refreshToken')
      .mockResolvedValue({ token: 'r', sub: 'rs', expiresAt: new Date() });
    const device = Device.create({ id: 'd', userId: 'user-err4', userAgent: 'UA' });
    jest.spyOn(deviceRepository, 'findByDevice').mockResolvedValue(device);
    jest.spyOn(sessionRepository, 'save').mockRejectedValue(new Error('Session save error'));
    const deviceArgs = { userAgent: 'UA' };
    await expect(interactor.generateSession('user-err4', deviceArgs)).rejects.toThrow(
      'Session save error',
    );
  });

  it('should pass correct args to findByDevice', async () => {
    const userId = 'user-args';
    const token: TokenDTO = { token: 'access-token', sub: 'sub-1', expiresAt: new Date() };
    const refreshToken: TokenDTO = { token: 'refresh-token', sub: 'sub-2', expiresAt: new Date() };
    const deviceArgs = {
      ip: '10.0.0.1',
      platform: 'Linux',
      browser: 'Firefox',
      osVersion: '20.04',
      userAgent: 'Mozilla/5.0 Firefox/89.0',
    };
    jest.spyOn(tokenGenerator, 'token').mockResolvedValue(token);
    jest.spyOn(tokenGenerator, 'refreshToken').mockResolvedValue(refreshToken);
    const findByDeviceSpy = jest.spyOn(deviceRepository, 'findByDevice').mockResolvedValue(null);
    jest
      .spyOn(deviceRepository, 'save')
      .mockResolvedValue(Device.create({ id: 'device-args', userId, ...deviceArgs }));
    jest.spyOn(sessionRepository, 'save').mockResolvedValue(
      Session.create({
        sub: token.sub,
        userId,
        refresh: refreshToken.sub,
        expiresAt: token.expiresAt!,
        deviceId: 'device-args',
      }),
    );
    await interactor.generateSession(userId, deviceArgs);
    expect(findByDeviceSpy).toHaveBeenCalledWith(userId, deviceArgs);
  });

  it('should convert tokens and user to AccessTokenDTO', () => {
    const user = {
      getId: () => 'user-1',
      getName: () => 'Test User',
      getEmail: () => 'test@example.com',
    } as User;
    const token: TokenDTO = { token: 'access-token', sub: 'sub-1', expiresAt: new Date() };
    const refreshToken: TokenDTO = { token: 'refresh-token', sub: 'sub-2', expiresAt: new Date() };
    const dto = interactor.accessTokenToJson(user, token, refreshToken);

    expect(dto.success).toBe(true);
    expect(dto.message).toBe('Token generated successfully');
    expect(dto.data.user.id).toBe('user-1');
    expect(dto.data.user.name).toBe('Test User');
    expect(dto.data.user.email).toBe('test@example.com');
    expect(dto.data.tokens.accessToken).toBe('access-token');
    expect(dto.data.tokens.refreshToken).toBe('refresh-token');
    expect(dto.timestamp).toBeDefined();
  });
});
