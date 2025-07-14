import { Module } from '@nestjs/common';
import { CustomConfigModule } from './config/config.module';
import { CustomJwtModule } from './jwt/jwt.module';
import { CustomDatabaseModule } from './database/database.module';

@Module({
  imports: [CustomConfigModule, CustomJwtModule, CustomDatabaseModule],
})
export class ConfigModule {}
