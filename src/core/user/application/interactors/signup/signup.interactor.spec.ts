import { SignupInteractor } from './signup.interactor';
import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { EncryptionService } from '@core/user/application/services/encryption.service';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { EmailAlreadyExistsException } from '@core/user/domain/exceptions/email-already-exists.exception';
import { WeakPasswordException } from '@core/user/domain/exceptions/weak-password.exception';
import { SessionRepository } from '@core/user/domain/repositories/session.repository';
import { DeviceRepository } from '@core/user/domain/repositories/device.repository';
import { User } from '@core/user/domain/entities/user';
import { Session } from '@core/user/domain/entities/session';
import { Device } from '@core/user/domain/entities/device';

describe('SignupInteractor', () => {
  let interactor: SignupInteractor;
  let userRepository: jest.Mocked<UserRepository>;
  let encryptionService: jest.Mocked<EncryptionService>;
  let tokenGenerator: jest.Mocked<TokenGenerator>;
  let sessionRepository: jest.Mocked<SessionRepository>;
  let deviceRepository: jest.Mocked<DeviceRepository>;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      existsEmail: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    encryptionService = {
      hashPassword: jest.fn(),
    } as unknown as jest.Mocked<EncryptionService>;

    tokenGenerator = {
      token: jest.fn(),
      refreshToken: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<TokenGenerator>;

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

    interactor = new SignupInteractor(
      userRepository,
      encryptionService,
      tokenGenerator,
      sessionRepository,
      deviceRepository,
    );
  });

  it('should throw EmailAlreadyExistsException if email exists', async () => {
    userRepository.findByEmail.mockResolvedValue({} as User);
    await expect(
      interactor.execute('test@example.com', 'StrongP@ssw0rd', 'Hilda Dicki'),
    ).rejects.toThrow(EmailAlreadyExistsException);
  });

  it('should throw WeakPasswordException if password is weak', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(interactor.execute('test@example.com', 'weak', 'Hilda Dicki')).rejects.toThrow(
      WeakPasswordException,
    );
  });

  it('should save user and return tokens if valid', async () => {
    const deviceArgs = {
      ip: '192.168.1.1',
      platform: 'Windows',
      browser: 'Edge',
      osVersion: '11',
      userAgent: 'Mozilla/5.0 Edge/90.0.818.49',
    };

    const hashPasswordSpy = jest.spyOn(encryptionService, 'hashPassword');
    hashPasswordSpy.mockResolvedValue('hashed');

    const saveUserSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(
      User.create({
        id: 'user-id',
        email: 'test@example.com',
        password:
          '$argon2id$v=19$m=65536,t=3,p=4$B5Eelo2eW6MyEo5oLCWDKA$qs8bowv2iPaclblC+ezyev3JV8dpMTpA5dPkF53tGr4',
        name: 'Hilda Dicki',
      }),
    );

    const saveSessionSpy = jest.spyOn(sessionRepository, 'save').mockResolvedValue({
      id: 'session-id',
      sub: 'token-uuid',
      refresh: 'token-uuid',
      userId: 'user-id',
      expiresAt: new Date(9876543210),
      createdAt: new Date(1234567890),
    } as unknown as Session);

    jest.spyOn(deviceRepository, 'findByDevice').mockResolvedValue(null);

    jest.spyOn(deviceRepository, 'save').mockResolvedValue(
      Device.create({
        id: 'device-1',
        userId: 'user-id',
        ...deviceArgs,
      }),
    );

    jest.spyOn(tokenGenerator, 'token').mockResolvedValue({
      token: 'access-token',
      sub: 'token-uuid',
      expiresAt: new Date(9876543210),
    });

    jest.spyOn(tokenGenerator, 'refreshToken').mockResolvedValue({
      token: 'refresh-token',
      sub: 'token-uuid',
      expiresAt: new Date(9876543210),
    });

    const result = await interactor.execute(
      'test@example.com',
      'StrongP@ssw0rd!',
      'Hilda Dicki',
      deviceArgs,
    );

    expect(hashPasswordSpy).toHaveBeenCalledWith('StrongP@ssw0rd!');
    expect(result).toEqual({
      data: {
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
        user: {
          id: 'user-id',
          email: 'test@example.com',
          name: 'Hilda Dicki',
        },
      },
      message: 'Token generated successfully',
      success: true,
      timestamp: expect.any(String) as unknown as string,
    });
    expect(saveUserSpy).toHaveBeenCalledWith({
      id: undefined,
      email: 'test@example.com',
      name: 'Hilda Dicki',
      password: 'hashed',
      updatedAt: null,
      createdAt: expect.any(Date) as Date,
    });
    expect(saveSessionSpy).toHaveBeenCalledWith({
      id: undefined,
      sub: 'token-uuid',
      refresh: 'token-uuid',
      userId: 'user-id',
      deviceId: 'device-1',
      expiresAt: expect.any(Date) as Date,
      createdAt: expect.any(Date) as Date,
    });
  });
});
