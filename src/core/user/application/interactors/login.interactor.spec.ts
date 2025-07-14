import { LoginInteractor } from './login.interactor';
import { UnAuthorizedException } from '@core/user/domain/exceptions/un-authorized.exception';
import { AccessTokenDto } from '../dto/access-token.dto';
import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { EncryptionService } from '../services/encryption.service';
import { TokenGenerator } from '../services/token-generator.service';
import { User } from '@core/user/domain/entities/user';

describe('LoginInteractor', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let encryptionService: jest.Mocked<EncryptionService>;
  let tokenGenerator: jest.Mocked<TokenGenerator>;
  let interactor: LoginInteractor;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      existsEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    encryptionService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    };

    tokenGenerator = {
      generate: jest.fn(),
      generateRefreshToken: jest.fn(),
    };

    interactor = new LoginInteractor(userRepository, encryptionService, tokenGenerator);
  });

  it('should throw UnAuthorizedException if email or password is missing', async () => {
    await expect(interactor.execute('', 'password')).rejects.toThrow(UnAuthorizedException);
    await expect(interactor.execute('email@test.com', '')).rejects.toThrow(UnAuthorizedException);
  });

  it('should throw UnAuthorizedException if user is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(interactor.execute('email@test.com', 'password')).rejects.toThrow(
      UnAuthorizedException,
    );
  });

  it('should throw UnAuthorizedException if password is invalid', async () => {
    const user = new User({ id: '1', email: 'email@test.com', name: 'Test', password: 'hashed' });
    userRepository.findByEmail.mockResolvedValue(user);
    encryptionService.comparePassword.mockResolvedValue(false);
    await expect(interactor.execute('email@test.com', 'password')).rejects.toThrow(
      UnAuthorizedException,
    );
  });

  it('should return access token if credentials are valid', async () => {
    const user = new User({ id: '1', email: 'email@test.com', name: 'Test', password: 'hashed' });
    const token: AccessTokenDto = {
      token: 'token',
      refresh: 'refresh',
      expiresAt: new Date(),
    };
    userRepository.findByEmail.mockResolvedValue(user);
    encryptionService.comparePassword.mockResolvedValue(true);
    tokenGenerator.generate.mockResolvedValue(token);
    await expect(interactor.execute('email@test.com', 'password')).resolves.toEqual(token);
  });
});
