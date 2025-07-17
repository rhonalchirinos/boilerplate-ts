import { DomainException } from '@core/shared/domain.exception';
import { ExceptionFilter, ArgumentsHost, Catch } from '@nestjs/common';
import { ErrorDTO, formatErrors } from '@shared/utils/format-error';
import { Response } from 'express';
import { ExceptionHttpMapper } from './exception.mapper';

@Catch(DomainException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): unknown {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof DomainException) {
      const exceptionType = exception.constructor as new (...args: any[]) => DomainException;

      const mapped = ExceptionHttpMapper.get(exceptionType);
      const statusCode = mapped?.statusCode ?? 400;

      const message = mapped?.message ?? exception.message;
      const formatter: ErrorDTO = statusCode == 422 ? formatErrors([], message) : { message };

      return response.status(statusCode).json(formatter);
    }

    throw exception;
  }
}
