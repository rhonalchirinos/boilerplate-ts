import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { JwtUserPayload } from '@core/user/application/dto/access-token.dto';
import { LoadSessionInteractor } from '@core/user/application/interactors/session/load-session.interactor';
import { Session } from '@core/user/domain/entities/session';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    @Inject(LoadSessionInteractor.name)
    private readonly loadSessionInteractor: LoadSessionInteractor,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtUserPayload): Promise<Session> {
    if (!payload) {
      throw new UnauthorizedException();
    }
    const session = await this.loadSessionInteractor.execute(payload.sub || '');
    return session;
  }
}
