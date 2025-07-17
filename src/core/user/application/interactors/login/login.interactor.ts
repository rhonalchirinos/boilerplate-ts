import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { EncryptionService } from '@core/user/application/services/encryption.service';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { AccessTokenDTO } from '@core/user/application/dto/access-token.dto';
import { InvalidCredentialsException } from '@core/user/domain/exceptions/invalid-credentials.exception';
import { SessionRepository } from '@core/user/domain/repositories/session.repository';
import { GenerateTokenInteractor } from '@core/user/application/interactors/token/generate-token.interactor';

export class LoginInteractor extends GenerateTokenInteractor {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
    protected readonly tokenGenerator: TokenGenerator,
    private readonly sessionRepository: SessionRepository,
  ) {
    super(tokenGenerator);
  }

  async execute(email: string, password: string): Promise<AccessTokenDTO> {
    if (!email || !password) {
      throw new InvalidCredentialsException('Invalid credentials');
    }

    const user = await this.userRepository.findByEmail(email.toLowerCase());

    if (user) {
      const isPasswordValid = await this.encryptionService.comparePassword(
        user.getPassword(),
        password,
      );

      if (isPasswordValid) {
        const { session, token, refresh } = await this.generateSession(user.getId());
        await this.sessionRepository.save(session);
        return this.accessTokenToJson(user, token, refresh);
      }
    }

    throw new InvalidCredentialsException('Invalid credentials');
  }
}
