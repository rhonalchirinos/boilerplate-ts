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
import { RequestSession } from '@shared/utils/request-session';
import { Session } from '@core/user/domain/entities/session';
import { LogoutInteractor } from '@core/user/application/interactors/logout/logout.interactor';

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
    @Inject(LogoutInteractor.name)
    private logoutInteractor: LogoutInteractor,
  ) {}

  private extractRequestMeta(request: RequestSession): {
    ip?: string;
    userAgent?: string;
    platform?: string;
    browser?: string;
    osVersion?: string;
  } {
    return {
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    };
  }

  @Post('login')
  async login(
    @Body(new LoginValidationPipe()) loginDto: LoginDto,
    @Request() request: RequestSession,
  ): Promise<AccessTokenDTO> {
    const meta = this.extractRequestMeta(request);
    return await this.loginInteractor.execute(loginDto.email, loginDto.password, meta);
  }

  @Post('signup')
  async signup(
    @Body(new SignupValidationPipe()) signupUserDto: SignupUserDTO,
    @Request() request: RequestSession,
  ): Promise<AccessTokenDTO> {
    const meta = this.extractRequestMeta(request);
    return await this.signupInteractor.execute(
      signupUserDto.email,
      signupUserDto.password,
      signupUserDto.name!,
      meta,
    );
  }

  @Delete('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async logout(@Request() request: RequestSession): Promise<void> {
    await this.logoutInteractor.execute(request.user as Session);
  }
}
