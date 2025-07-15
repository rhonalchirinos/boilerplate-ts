import { DomainException } from '@core/shared/domain.exception';
import { ExceptionFilter, ArgumentsHost, Catch } from '@nestjs/common';
import { ErrorDTO, formatErrors } from '@shared/utils/format-error';
import { Response } from 'express';

@Catch(DomainException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): unknown {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof DomainException) {
      const formatter: ErrorDTO = formatErrors([], exception.message);

      return response.status(401).json(formatter);
    }

    throw exception;
  }
}
