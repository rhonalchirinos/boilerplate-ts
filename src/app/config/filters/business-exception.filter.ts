import { InvalidCredentialsException } from '@core/user/domain/exceptions/invalid-credentials.exception';
import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): unknown {
    if (exception instanceof InvalidCredentialsException) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      return response.status(401).json({
        message: exception.message,
      });
    }

    throw exception;
  }
}
