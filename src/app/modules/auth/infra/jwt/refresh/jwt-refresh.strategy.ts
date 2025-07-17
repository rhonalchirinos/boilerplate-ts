import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtUserPayload } from '@core/user/application/dto/access-token.dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('jwt.secret'),
    });
  }

  validate(payload: JwtUserPayload): string {
    if (!payload) {
      throw new UnauthorizedException();
    }
    // const accessToken = await this.accessTokenRepository.findByRefreshToken(payload.sub);
    // if (!accessToken) {
    //   throw new UnauthorizedException();
    // }

    return payload.userId;
  }
}
