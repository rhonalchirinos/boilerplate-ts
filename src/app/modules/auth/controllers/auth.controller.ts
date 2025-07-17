import { AccessTokenDTO } from '@core/user/application/dto/access-token.dto';
import { LoginInteractor } from '@core/user/application/interactors/login/login.interactor';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Inject,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginValidationPipe } from '../infra/zod/login-validation.pipe';
import { SignupInteractor } from '@core/user/application/interactors/signup/signup.interactor';
import { SignupUserDTO } from './dto/signup.dto';
import { SignupValidationPipe } from '../infra/zod/signup-validation.pipe';
import { JwtAuthGuard } from '../infra/jwt/auth/jwt-auth.guard';
import { DestroySessionInteractor } from '@core/user/application/interactors/session/destroy-session.interactor';
import { RequestSession } from '@shared/utils/request-session';
import { Session } from '@core/user/domain/entities/session';

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
    @Inject(DestroySessionInteractor.name)
    private destroySessionInteractor: DestroySessionInteractor,
  ) {}

  @Post('login')
  async login(@Body(new LoginValidationPipe()) loginDto: LoginDto): Promise<AccessTokenDTO> {
    return await this.loginInteractor.execute(loginDto.email, loginDto.password);
  }

  @Post('signup')
  async signup(
    @Body(new SignupValidationPipe()) signupUserDto: SignupUserDTO,
  ): Promise<AccessTokenDTO> {
    return await this.signupInteractor.execute(
      signupUserDto.email,
      signupUserDto.password,
      signupUserDto.name!,
    );
  }

  @Delete('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async logout(@Request() request: RequestSession): Promise<void> {
    await this.destroySessionInteractor.execute(request.user as Session);
  }
}
