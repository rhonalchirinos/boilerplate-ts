import { EncryptionService } from '@core/user/application/services/encryption.service';
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class ArgonEncryptionService implements EncryptionService {
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2id });
  }

  async comparePassword(hashedPassword: string, plainTextPassword: string): Promise<boolean> {
    return argon2.verify(hashedPassword, plainTextPassword);
  }
}
