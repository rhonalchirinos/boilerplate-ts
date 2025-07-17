import { SignupInteractor } from './signup.interactor';
import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { EncryptionService } from '@core/user/application/services/encryption.service';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { EmailAlreadyExistsException } from '@core/user/domain/exceptions/email-already-exists.exception';
import { WeakPasswordException } from '@core/user/domain/exceptions/weak-password.exception';
import { SessionRepository } from '@core/user/domain/repositories/session.repository';
import { User } from '@core/user/domain/entities/user';
import { Session } from '@core/user/domain/entities/session';

describe('SignupInteractor', () => {
  let interactor: SignupInteractor;
  let userRepository: jest.Mocked<UserRepository>;
  let encryptionService: jest.Mocked<EncryptionService>;
  let tokenGenerator: jest.Mocked<TokenGenerator>;
  let sessionRepository: jest.Mocked<SessionRepository>;

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
      generate: jest.fn(),
    } as unknown as jest.Mocked<TokenGenerator>;

    sessionRepository = {
      save: jest.fn(),
    } as unknown as jest.Mocked<SessionRepository>;

    interactor = new SignupInteractor(
      userRepository,
      encryptionService,
      tokenGenerator,
      sessionRepository,
    );

    jest.spyOn(interactor as any, 'generateSession').mockImplementation(() => ({
      session: { id: 'session-id' },
      token: { token: 'access-token', expiresAt: new Date(1234567890) },
      refresh: { token: 'refresh-token', expiresAt: new Date(9876543210) },
    }));
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
    const hashPasswordSpy = jest.spyOn(encryptionService, 'hashPassword');
    hashPasswordSpy.mockResolvedValue('hashed');

    const saveUserSpy = jest.spyOn(userRepository, 'save').mockResolvedValue({
      id: 'user-id',
      email: 'test@example.com',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$B5Eelo2eW6MyEo5oLCWDKA$qs8bowv2iPaclblC+ezyev3JV8dpMTpA5dPkF53tGr4',
    } as unknown as User);

    const saveSessionSpy = jest.spyOn(sessionRepository, 'save').mockResolvedValue({
      id: 'session-id',
      sub: 'token-uuid',
      refresh: 'token-uuid',
      userId: 'user-id',
      expiresAt: new Date(9876543210),
      createdAt: new Date(1234567890),
    } as unknown as Session);

    const result = await interactor.execute('test@example.com', 'StrongP@ssw0rd!', 'Hilda Dicki');

    expect(hashPasswordSpy).toHaveBeenCalledWith('StrongP@ssw0rd!');
    expect(saveUserSpy).toHaveBeenCalled();
    expect(saveSessionSpy).toHaveBeenCalled();

    expect(result).toEqual({
      data: {
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
        user: {
          id: undefined,
          email: 'test@example.com',
          name: 'Hilda Dicki',
        },
      },
      message: 'Token generated successfully',
      success: true,
      timestamp: expect.any(String) as unknown as string,
    });
  });
});
