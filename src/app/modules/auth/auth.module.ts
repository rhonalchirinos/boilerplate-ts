import { Module } from '@nestjs/common';
import { AuthController } from '@app/modules/auth/controllers/auth.controller';
import { PrismaUserRepository } from '@app/modules/auth/infra/repositories/prisma-user.repository';
import { ArgonEncryptionService } from '@app/modules/auth/infra/argon2/argon-encryption.service';
import { JwtTokenGenerator } from '@app/modules/auth/infra/jwt/jwt-token-generator';
import { LoginInteractor } from '@core/user/application/interactors/login.interactor';
import { LoginValidationPipe } from './infra/zod/login-validation.pipe';
import { SignupValidationPipe } from './infra/zod/signup-validation.pipe';
import { SignupInteractor } from '@core/user/application/interactors/signup.interactor';

@Module({
  controllers: [AuthController],
  providers: [
    PrismaUserRepository,
    ArgonEncryptionService,
    JwtTokenGenerator,
    LoginValidationPipe,
    SignupValidationPipe,
    {
      provide: LoginInteractor.name,
      useFactory: (
        userRepository: PrismaUserRepository,
        encryptionService: ArgonEncryptionService,
        tokenGenerator: JwtTokenGenerator,
      ) => new LoginInteractor(userRepository, encryptionService, tokenGenerator),
      inject: [PrismaUserRepository, ArgonEncryptionService, JwtTokenGenerator],
    },
    {
      provide: SignupInteractor.name,
      useFactory: (
        userRepository: PrismaUserRepository,
        encryptionService: ArgonEncryptionService,
        tokenGenerator: JwtTokenGenerator,
      ) => new SignupInteractor(userRepository, encryptionService, tokenGenerator),
      inject: [PrismaUserRepository, ArgonEncryptionService, JwtTokenGenerator],
    },
  ],
})
export class AuthModule {}
