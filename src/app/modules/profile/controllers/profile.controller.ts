import { Controller, Get, Req, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '@app/modules/auth/infra/jwt/auth/jwt-auth.guard';
import { GetProfileInteractor } from '@core/user/application/interactors/profile/get-profile.interactor';
import { RequestSession } from '@shared/utils/request-session';
import { Session } from '@core/user/domain/entities/session';

@Controller('profile')
export class ProfileController {
  constructor(
    @Inject(GetProfileInteractor.name)
    private readonly getProfileInteractor: GetProfileInteractor,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() request: RequestSession) {
    const session: Session = request.user as Session;
    const user = await this.getProfileInteractor.execute(session.getUserId());
    return user.toJSON();
  }
}
