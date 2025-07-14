import { InvalidCredentialsException } from '@core/user/domain/exceptions/invalid-credentials.exception';
import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ErrorDTO, formatErrors } from '@shared/utils/format-error';
import { Response } from 'express';

export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): unknown {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof InvalidCredentialsException) {
      const formatter: ErrorDTO = formatErrors([], exception.message);

      return response.status(401).json(formatter);
    }

    throw exception;
  }
}
