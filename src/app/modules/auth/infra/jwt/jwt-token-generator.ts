import { AccessTokenDto } from '@core/user/application/dto/access-token.dto';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
  constructor(protected jwtService: JwtService) {}

  private async createToken(
    payload: Record<string, unknown>,
    expiresInSeconds: number,
  ): Promise<{ token: string; expiresAt: Date }> {
    const sub = v4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInSeconds * 1000);

    const token = await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      { expiresIn: expiresInSeconds, algorithm: 'HS256' },
    );

    return { token, expiresAt };
  }

  async generateRefreshToken(payload: Record<string, unknown>): Promise<string> {
    const expiresInSeconds = 3600 * 24 * 8; // 7 días
    return (await this.createToken(payload, expiresInSeconds)).token;
  }

  async generate(payload: Record<string, unknown>): Promise<AccessTokenDto> {
    const accessExpiresIn = 3600 * 24 * 7;
    const { token, expiresAt } = await this.createToken(payload, accessExpiresIn);

    const refresh = await this.generateRefreshToken(payload);

    return {
      token,
      expiresAt,
      refresh,
    };
  }
}
