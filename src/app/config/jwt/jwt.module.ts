import { Global, Module } from '@nestjs/common';

import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.getOrThrow<string>('jwt.secret');

        return { secret: secret, signOptions: { expiresIn: '1h' } };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class CustomJwtModule {}
