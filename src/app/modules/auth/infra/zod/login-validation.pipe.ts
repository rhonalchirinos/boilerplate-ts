import { ZodValidationPipe } from '@app/pipes/zod-validation.pipe';
import { LoginDto } from '../../controllers/dto/login.dto';
import { Injectable } from '@nestjs/common';
import z from 'zod';

@Injectable()
export class LoginValidationPipe extends ZodValidationPipe<LoginDto> {
  constructor() {
    super(
      z.object({
        email: z.email(),
        password: z.string().min(8),
      }),
      'Invalid login credentials',
    );
  }
}
