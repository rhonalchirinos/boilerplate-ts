import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { EncryptionService } from '@core/user/application/services/encryption.service';
import { AccessTokenDto } from '../dto/access-token.dto';
import { User } from '@core/user/domain/entities/user';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { EmailAlreadyExistsException } from '@core/user/domain/exceptions/email-already-exists.exception';
import { WeakPasswordException } from '@core/user/domain/exceptions/weak-password.exception';

export class SignupInteractor {
  constructor(
    private authRepository: UserRepository,
    private encryptionService: EncryptionService,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(email: string, password: string): Promise<AccessTokenDto> {
    const emailExists = await this.emailExists(email);
    if (emailExists) {
      throw new EmailAlreadyExistsException();
    }

    if (!this.isPasswordStrong(password)) {
      throw new WeakPasswordException();
    }

    const hashedPassword = await this.encryptionService.hashPassword(String(password));
    const user = new User({
      email: email.toLocaleLowerCase(),
      password: hashedPassword,
    });

    await this.authRepository.save(user);

    if (user) {
      return this.tokenGenerator.generate({ id: user.id, email: user.email, name: user.name });
    }

    return user;
  }

  private async emailExists(email: string): Promise<boolean> {
    const user = await this.authRepository.findByEmail(email.toLocaleLowerCase());
    return !!user;
  }

  private isPasswordStrong(password: string): boolean {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return strongPasswordRegex.test(password);
  }
}
