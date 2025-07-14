import { AccessTokenDto } from '@core/user/application/dto/access-token.dto';
import { LoginInteractor } from '@core/user/application/interactors/login.interactor';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginValidationPipe } from '../infra/zod/login-validation.pipe';

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
  async login(@Body(new LoginValidationPipe()) loginDto: LoginDto): Promise<AccessTokenDto> {
    return await this.loginInteractor.execute(loginDto.email, loginDto.password);
  }
}
