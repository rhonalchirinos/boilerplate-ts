import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { HealthInteractor } from '@core/home/application/health.interactor';

@Module({
  controllers: [AppController],
  providers: [HealthInteractor],
})
export class HomeModule {}
