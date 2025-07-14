import { Global, Module } from '@nestjs/common';
import { PrismaService } from './infra/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CustomDatabaseModule {}
