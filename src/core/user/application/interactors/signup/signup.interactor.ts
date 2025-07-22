import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { EncryptionService } from '@core/user/application/services/encryption.service';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { EmailAlreadyExistsException } from '@core/user/domain/exceptions/email-already-exists.exception';
import { WeakPasswordException } from '@core/user/domain/exceptions/weak-password.exception';
import { SessionRepository } from '@core/user/domain/repositories/session.repository';
import { AccessTokenDTO } from '@core/user/application/dto/access-token.dto';
import { GenerateTokenInteractor } from '@core/user/application/interactors/token/generate-token.interactor';
import { User } from '@core/user/domain/entities/user';
import { DeviceRepository } from '@core/user/domain/repositories/device.repository';

export class SignupInteractor extends GenerateTokenInteractor {
  constructor(
    protected readonly userRepository: UserRepository,
    protected readonly encryptionService: EncryptionService,
    protected readonly tokenGenerator: TokenGenerator,
    protected readonly sessionRepository: SessionRepository,
    protected readonly deviceRepository: DeviceRepository,
  ) {
    super(tokenGenerator, deviceRepository, sessionRepository);
  }

  async execute(
    email: string,
    password: string,
    name: string,
    args: {
      ip?: string;
      userAgent?: string;
      platform?: string;
      browser?: string;
      osVersion?: string;
    } = {},
  ): Promise<AccessTokenDTO> {
    const emailExists = await this.emailExists(email);
    if (emailExists) {
      throw new EmailAlreadyExistsException();
    }

    if (!this.isPasswordStrong(password)) {
      throw new WeakPasswordException();
    }

    const hashedPassword = await this.encryptionService.hashPassword(String(password));

    const user = await this.userRepository.save(
      User.create({
        email: email.toLocaleLowerCase(),
        password: hashedPassword,
        name,
      }),
    );

    if (user) {
      const { token, refresh } = await this.generateSession(user.getId(), args);
      return this.accessTokenToJson(user, token, refresh);
    }

    return user;
  }

  private async emailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email.toLocaleLowerCase());
    return !!user;
  }

  private isPasswordStrong(password: string): boolean {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return strongPasswordRegex.test(password);
  }
}
