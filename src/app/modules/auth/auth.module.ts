import { Module } from '@nestjs/common';
import { AuthController } from '@app/modules/auth/controllers/auth.controller';
import { PrismaUserRepository } from '@app/modules/auth/infra/repositories/prisma-user.repository';
import { ArgonEncryptionService } from '@app/modules/auth/infra/argon2/argon-encryption.service';
import { LoginInteractor } from '@core/user/application/interactors/login/login.interactor';
import { LoginValidationPipe } from './infra/zod/login-validation.pipe';
import { SignupValidationPipe } from './infra/zod/signup-validation.pipe';
import { SignupInteractor } from '@core/user/application/interactors/signup/signup.interactor';
import { JwtTokenGenerator } from './infra/jwt/token/jwt-token-generator';
import { JwtStrategy } from './infra/jwt/auth/jwt-strategy';
import { JwtRefreshStrategy } from './infra/jwt/refresh/jwt-refresh.strategy';
import { JwtVerifyStrategy } from './infra/jwt/verify/jwt-verify.strategy';
import { PrismaSessionRepository } from './infra/repositories/prisma-session.repository';
import { LoadSessionInteractor } from '@core/user/application/interactors/session/load-session.interactor';
import { DestroySessionInteractor } from '@core/user/application/interactors/session/destroy-session.interactor';

const interactors = [
  {
    provide: LoginInteractor.name,
    useFactory: (
      userRepository: PrismaUserRepository,
      encryptionService: ArgonEncryptionService,
      tokenGenerator: JwtTokenGenerator,
      sessionRepository: PrismaSessionRepository,
    ) => new LoginInteractor(userRepository, encryptionService, tokenGenerator, sessionRepository),
    inject: [
      PrismaUserRepository,
      ArgonEncryptionService,
      JwtTokenGenerator,
      PrismaSessionRepository,
    ],
  },
  {
    provide: SignupInteractor.name,
    useFactory: (
      userRepository: PrismaUserRepository,
      encryptionService: ArgonEncryptionService,
      tokenGenerator: JwtTokenGenerator,
      sessionRepository: PrismaSessionRepository,
    ) => new SignupInteractor(userRepository, encryptionService, tokenGenerator, sessionRepository),
    inject: [
      PrismaUserRepository,
      ArgonEncryptionService,
      JwtTokenGenerator,
      PrismaSessionRepository,
    ],
  },
  {
    provide: LoadSessionInteractor.name,
    useFactory: (sessionRepository: PrismaSessionRepository) =>
      new LoadSessionInteractor(sessionRepository),
    inject: [PrismaSessionRepository],
  },
  {
    provide: DestroySessionInteractor.name,
    useFactory: (sessionRepository: PrismaSessionRepository) =>
      new DestroySessionInteractor(sessionRepository),
    inject: [PrismaSessionRepository],
  },
];

@Module({
  controllers: [AuthController],
  providers: [
    ArgonEncryptionService,
    PrismaUserRepository,
    PrismaSessionRepository,
    LoginValidationPipe,
    SignupValidationPipe,
    JwtStrategy,
    JwtTokenGenerator,
    JwtRefreshStrategy,
    JwtVerifyStrategy,
    ...interactors,
  ],
})
export class AuthModule {}
