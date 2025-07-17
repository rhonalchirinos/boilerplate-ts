import { JwtUserPayload, TokenDTO } from '@core/user/application/dto/access-token.dto';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
  constructor(protected jwtService: JwtService) {}

  public async create(payload: JwtUserPayload, expiresInSeconds: number): Promise<TokenDTO> {
    const sub = v4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInSeconds * 1000);

    const token = await this.jwtService.signAsync(
      { sub, ...payload },
      { expiresIn: expiresInSeconds, algorithm: 'HS256' },
    );

    return { sub, token, expiresAt };
  }

  async refreshToken(payload: JwtUserPayload): Promise<TokenDTO> {
    const expiresInSeconds = 3600 * 24 * 8;
    const token = await this.create(payload, expiresInSeconds);

    return token;
  }

  async token(payload: JwtUserPayload): Promise<TokenDTO> {
    const accessExpiresIn = 3600 * 24 * 7;
    const token = await this.create(payload, accessExpiresIn);

    return token;
  }
}
