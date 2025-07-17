import { Module } from '@nestjs/common';
import { HomeModule } from '@app/modules/home/home.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [ConfigModule, HomeModule, AuthModule, ProfileModule],
})
export class AppModule {}
