type FormattedError = {
  field: string;
  error: string;
};

export type ErrorDTO = {
  message?: string;
  errors?: FormattedError[];
};

export function formatErrors(errors?: FormattedError[], message?: string): ErrorDTO {
  return { message: message || 'Validation failed', errors };
}
