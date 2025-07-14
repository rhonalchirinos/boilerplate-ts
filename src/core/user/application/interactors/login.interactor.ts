import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { EncryptionService } from '../services/encryption.service';
import { TokenGenerator } from '../services/token-generator.service';
import { AccessTokenDto } from '../dto/access-token.dto';
import { InvalidCredentialsException } from '@core/user/domain/exceptions/invalid-credentials.exception';

export class LoginInteractor {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(email: string, password: string): Promise<AccessTokenDto> {
    if (!email || !password) {
      throw new InvalidCredentialsException('Invalid credentials');
    }

    const user = await this.userRepository.findByEmail(email.toLowerCase());

    if (user) {
      const isPasswordValid = await this.encryptionService.comparePassword(password, user.password);

      if (isPasswordValid) {
        return this.tokenGenerator.generate({ id: user.id, email: user.email, name: user.name });
      }
    }

    throw new InvalidCredentialsException('Invalid credentials');
  }
}
