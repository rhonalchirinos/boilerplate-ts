import { SignupInteractor } from './signup.interactor';
import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { EncryptionService } from '@core/user/application/services/encryption.service';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { EmailAlreadyExistsException } from '@core/user/domain/exceptions/email-already-exists.exception';
import { WeakPasswordException } from '@core/user/domain/exceptions/weak-password.exception';
import { User } from '@core/user/domain/entities/user';
import { AccessTokenDto } from '../dto/access-token.dto';

describe('SignupInteractor', () => {
  let interactor: SignupInteractor;
  let userRepository: jest.Mocked<UserRepository>;
  let encryptionService: jest.Mocked<EncryptionService>;
  let tokenGenerator: jest.Mocked<TokenGenerator>;

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
    interactor = new SignupInteractor(userRepository, encryptionService, tokenGenerator);
  });

  it('should throw EmailAlreadyExistsException if email exists', async () => {
    userRepository.findByEmail.mockResolvedValue({} as User);
    await expect(interactor.execute('test@example.com', 'StrongP@ssw0rd')).rejects.toThrow(
      EmailAlreadyExistsException,
    );
  });

  it('should throw WeakPasswordException if password is weak', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(interactor.execute('test@example.com', 'weak')).rejects.toThrow(
      WeakPasswordException,
    );
  });

  it('should save user and return token if valid', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    const hashPasswordSpy = jest.spyOn(encryptionService, 'hashPassword');
    hashPasswordSpy.mockResolvedValue('hashed');
    const token: AccessTokenDto = { token: 'token' };
    tokenGenerator.generate.mockResolvedValue(token);
    userRepository.save.mockResolvedValue({} as User);
    const result = await interactor.execute('test@example.com', 'StrongP@ssw0rd!');
    expect(hashPasswordSpy).toHaveBeenCalledWith('StrongP@ssw0rd!');
    expect(result).toEqual(token);
  });
});
