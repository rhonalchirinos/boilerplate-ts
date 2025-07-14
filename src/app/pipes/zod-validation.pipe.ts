import { PipeTransform, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { formatErrors, ErrorDTO } from '@shared/utils/format-error';
import { z, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<T> {
  constructor(
    private readonly schema: z.ZodType<T>,
    private readonly message: string,
  ) {}

  async transform(value: T): Promise<T> {
    const result = await this.schema.safeParseAsync(value);

    if (!result.success) {
      const error: ZodError = result.error;
      const formatted = this.formatZodErrors(error);

      throw new UnprocessableEntityException(formatted);
    }

    return result.data;
  }

  formatZodErrors(error: ZodError): ErrorDTO {
    return formatErrors(
      error.issues.map((issue) => ({ field: issue.path.join('.'), error: issue.message })),
      this.message,
    );
  }
}
