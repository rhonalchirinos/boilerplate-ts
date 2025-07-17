import { LoginInteractor } from './login.interactor';
import { InvalidCredentialsException } from '@core/user/domain/exceptions/invalid-credentials.exception';
import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { EncryptionService } from '@core/user/application/services/encryption.service';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { SessionRepository } from '@core/user/domain/repositories/session.repository';
import { User } from '@core/user/domain/entities/user';

describe('LoginInteractor', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let encryptionService: jest.Mocked<EncryptionService>;
  let tokenGenerator: jest.Mocked<TokenGenerator>;
  let sessionRepository: jest.Mocked<SessionRepository>;
  let interactor: LoginInteractor;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      existsEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    encryptionService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    } as jest.Mocked<EncryptionService>;

    tokenGenerator = {
      token: jest.fn(),
      refreshToken: jest.fn(),
      create: jest.fn(),
    } as jest.Mocked<TokenGenerator>;

    sessionRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SessionRepository>;

    interactor = new LoginInteractor(
      userRepository,
      encryptionService,
      tokenGenerator,
      sessionRepository,
    );
  });

  it('should throw InvalidCredentialsException if email or password is missing', async () => {
    await expect(interactor.execute('', 'password')).rejects.toThrow(InvalidCredentialsException);
    await expect(interactor.execute('email@test.com', '')).rejects.toThrow(
      InvalidCredentialsException,
    );
  });

  it('should throw InvalidCredentialsException if user is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(interactor.execute('email@test.com', 'password')).rejects.toThrow(
      InvalidCredentialsException,
    );
  });

  it('should throw InvalidCredentialsException if password is invalid', async () => {
    const user = User.create({
      id: '1',
      email: 'email@test.com',
      name: 'Test',
      password: 'hashed',
    });
    userRepository.findByEmail.mockResolvedValue(user);
    encryptionService.comparePassword.mockResolvedValue(false);
    await expect(interactor.execute('email@test.com', 'password')).rejects.toThrow(
      InvalidCredentialsException,
    );
  });

  it('should return access and refresh tokens if credentials are valid', async () => {
    const user = User.create({
      id: '1',
      email: 'email@test.com',
      name: 'Test',
      password: 'hashed',
    });
    userRepository.findByEmail.mockResolvedValue(user);
    encryptionService.comparePassword.mockResolvedValue(true);
    interactor.generateSession = jest.fn().mockResolvedValue({
      session: { id: 'session-id' },
      token: {
        token: 'access-token',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      },
      refresh: {
        token: 'refresh-token',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    const saveSpy = jest.spyOn(sessionRepository, 'save');
    const token = {
      token: 'access-token',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    };

    const refresh = {
      token: 'refresh-token',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    };
    const session = { id: 'session-id' };

    const accessTokenDto = await interactor.execute('email@test.com', 'password');

    expect(accessTokenDto).toEqual({
      success: true,
      message: 'Token generated successfully',
      timestamp: expect.any(String) as unknown as string,
      data: {
        tokens: {
          accessToken: token.token,
          refreshToken: refresh.token,
        },
        user: {
          id: user.getId(),
          email: user.getEmail(),
          name: user.getName(),
        },
      },
    });
    expect(saveSpy).toHaveBeenCalledWith(session);
  });
});
