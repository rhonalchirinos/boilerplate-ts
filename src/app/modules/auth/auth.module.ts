import { Module } from '@nestjs/common';
import { AuthController } from '@app/modules/auth/controllers/auth.controller';
import { PrismaUserRepository } from '@app/modules/auth/infra/repositories/prisma-user.repository';
import { ArgonEncryptionService } from '@app/modules/auth/infra/argon2/argon-encryption.service';
import { JwtTokenGenerator } from '@app/modules/auth/infra/jwt/jwt-token-generator';
import { LoginInteractor } from '@core/user/application/interactors/login.interactor';

@Module({
  controllers: [AuthController],
  providers: [
    PrismaUserRepository,
    ArgonEncryptionService,
    JwtTokenGenerator,
    {
      provide: LoginInteractor.name,
      useFactory: (
        userRepository: PrismaUserRepository,
        encryptionService: ArgonEncryptionService,
        tokenGenerator: JwtTokenGenerator,
      ) => new LoginInteractor(userRepository, encryptionService, tokenGenerator),
      inject: [PrismaUserRepository, ArgonEncryptionService, JwtTokenGenerator],
    },
  ],
})
export class AuthModule {}
