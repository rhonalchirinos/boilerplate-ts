import { Module } from '@nestjs/common';
import { HomeModule } from '@app/modules/home/home.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, HomeModule, AuthModule],
})
export class AppModule {}
