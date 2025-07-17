import { JwtUserPayload } from '@core/user/application/dto/access-token.dto';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtVerifyStrategy extends PassportStrategy(Strategy, 'jwt-verify') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      secretOrKey: config.getOrThrow<string>('jwt.secret'),
    });
  }

  validate(payload: JwtUserPayload): JwtUserPayload {
    if (!payload || !payload.sub || typeof payload.sub !== 'string' || payload.sub.trim() === '') {
      throw new UnprocessableEntityException('Invalid JWT payload: missing or invalid sub');
    }
    return payload;
  }
}
