import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { GetProfileInteractor } from '../../../core/user/application/interactors/profile/get-profile.interactor';
import { PrismaUserRepository } from '@app/modules/auth/infra/repositories/prisma-user.repository';

@Module({
  controllers: [ProfileController],
  providers: [
    PrismaUserRepository,
    {
      provide: GetProfileInteractor.name,
      useFactory: (userRepository: PrismaUserRepository) =>
        new GetProfileInteractor(userRepository),
      inject: [PrismaUserRepository],
    },
  ],
})
export class ProfileModule {}
