import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { EncryptionService } from '@core/user/application/services/encryption.service';
import { User } from '@core/user/domain/entities/user';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { EmailAlreadyExistsException } from '@core/user/domain/exceptions/email-already-exists.exception';
import { WeakPasswordException } from '@core/user/domain/exceptions/weak-password.exception';
import { SessionRepository } from '@core/user/domain/repositories/session.repository';
import { AccessTokenDTO } from '../../dto/access-token.dto';
import { GenerateTokenInteractor } from '../token/generate-token.interactor';

export class SignupInteractor extends GenerateTokenInteractor {
  constructor(
    private readonly authRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
    protected readonly tokenGenerator: TokenGenerator,
    private readonly sessionRepository: SessionRepository,
  ) {
    super(tokenGenerator);
  }

  async execute(email: string, password: string, name: string): Promise<AccessTokenDTO> {
    const emailExists = await this.emailExists(email);
    if (emailExists) {
      throw new EmailAlreadyExistsException();
    }

    if (!this.isPasswordStrong(password)) {
      throw new WeakPasswordException();
    }

    const hashedPassword = await this.encryptionService.hashPassword(String(password));
    const user = User.create({
      email: email.toLocaleLowerCase(),
      password: hashedPassword,
      name,
    });

    await this.authRepository.save(user);

    if (user) {
      const { session, token, refresh } = await this.generateSession(user.getId());
      await this.sessionRepository.save(session);
      return this.accessTokenToJson(user, token, refresh);
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
