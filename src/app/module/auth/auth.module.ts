import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { PrismaUserRepository } from './drivers/repositories/prisma-user.repository';
import { ArgonEncryptionService } from './drivers/services/argon-encryption.service';
import { JwtTokenGenerator } from './drivers/services/jwt-token-generator';
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
