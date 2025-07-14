import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { BusinessExceptionFilter } from '@app/filters/business-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new BusinessExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
