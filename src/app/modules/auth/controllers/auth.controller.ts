import { AccessTokenDto } from '@core/user/application/dto/access-token.dto';
import { LoginInteractor } from '@core/user/application/interactors/login.interactor';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginValidationPipe } from '../infra/zod/login-validation.pipe';
import { SignupInteractor } from '@core/user/application/interactors/signup.interactor';
import { SignupUserDTO } from './dto/signup.dto';
import { SignupValidationPipe } from '../infra/zod/signup-validation.pipe';

@Controller('auth')
export class AuthController {
  /**
   *
   */
  public constructor(
    @Inject(LoginInteractor.name)
    private loginInteractor: LoginInteractor,
    @Inject(SignupInteractor.name)
    private signupInteractor: SignupInteractor,
  ) {}

  @Post('login')
  async login(@Body(new LoginValidationPipe()) loginDto: LoginDto): Promise<AccessTokenDto> {
    return await this.loginInteractor.execute(loginDto.email, loginDto.password);
  }

  @Post('signup')
  async signup(
    @Body(new SignupValidationPipe()) signupUserDto: SignupUserDTO,
  ): Promise<AccessTokenDto> {
    return await this.signupInteractor.execute(signupUserDto.email, signupUserDto.password);
  }
}
