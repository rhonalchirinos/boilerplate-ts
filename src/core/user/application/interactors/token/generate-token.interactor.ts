import { Session } from '@core/user/domain/entities/session';
import { AccessTokenDTO, TokenDTO } from '@core/user/application/dto/access-token.dto';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { User } from '@core/user/domain/entities/user';

export class GenerateTokenInteractor {
  constructor(protected readonly tokenGenerator: TokenGenerator) {}

  public async generateSession(
    userId: string,
  ): Promise<{ session: Session; token: TokenDTO; refresh: TokenDTO }> {
    const token = await this.tokenGenerator.token({ userId });
    const refreshToken = await this.tokenGenerator.refreshToken({ userId });
    const session = Session.create({
      id: undefined,
      sub: token.sub,
      userId,
      refresh: refreshToken.sub,
      expiresAt: token.expiresAt!,
    });

    return { session, token, refresh: refreshToken };
  }

  accessTokenToJson(user: User, token: TokenDTO, refresh: TokenDTO): AccessTokenDTO {
    return {
      success: true,
      message: 'Token generated successfully',
      data: {
        user: {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
        },
        tokens: {
          accessToken: token.token,
          refreshToken: refresh.token,
        },
      },
      timestamp: new Date().toISOString(),
    };
  }
}
