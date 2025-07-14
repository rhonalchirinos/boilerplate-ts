import { Module } from '@nestjs/common';
import { HomeModule } from '@app/module/home/home.module';
import { AuthModule } from './module/auth/auth.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, HomeModule, AuthModule],
})
export class AppModule {}
