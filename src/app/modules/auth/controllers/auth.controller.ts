import { AccessTokenDto } from '@core/user/application/dto/access-token.dto';
import { LoginInteractor } from '@core/user/application/interactors/login.interactor';
import { Body, Controller, Inject, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  /**
   *
   */
  public constructor(
    @Inject(LoginInteractor.name)
    private loginInteractor: LoginInteractor,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<AccessTokenDto> {
    return await this.loginInteractor.execute(body.email, body.password);
  }
}
