import { HealthInteractor } from '@core/home/application/health.interactor';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly healthInteractor: HealthInteractor) {}

  @Get()
  getHello(): string {
    return this.healthInteractor.checkHealth();
  }
}
