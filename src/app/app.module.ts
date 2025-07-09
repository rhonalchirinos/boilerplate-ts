import { Module } from '@nestjs/common';
import { HomeModule } from '@app/module/home/home.module';

@Module({
  imports: [HomeModule],
})
export class AppModule {}
