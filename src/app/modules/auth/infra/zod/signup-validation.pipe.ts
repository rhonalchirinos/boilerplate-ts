import { ZodValidationPipe } from '@app/pipes/zod-validation.pipe';
import { SignupUserDTO } from '../../controllers/dto/signup.dto';
import { Injectable } from '@nestjs/common';
import z from 'zod';

@Injectable()
export class SignupValidationPipe extends ZodValidationPipe<SignupUserDTO> {
  constructor() {
    super(
      z.object({
        email: z.email(),
        password: z
          .string()
          .min(8, { message: 'Password must be at least 8 characters long' })
          .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
          .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
          .regex(/[0-9]/, { message: 'Password must contain at least one number' })
          .regex(/[^a-zA-Z0-9]/, {
            message: 'Password must contain at least one special character',
          }),
      }),
      'Invalid signup credentials',
    );
  }
}
