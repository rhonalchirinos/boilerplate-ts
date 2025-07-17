import { DomainException } from '@core/shared/domain.exception';
import { EmailAlreadyExistsException } from '@core/user/domain/exceptions/email-already-exists.exception';
import { InvalidCredentialsException } from '@core/user/domain/exceptions/invalid-credentials.exception';
import { SessionNotFoundException } from '@core/user/domain/exceptions/session-not-found.exception';
import { UserNotFoundException } from '@core/user/domain/exceptions/user-not-found.exception';
import { WeakPasswordException } from '@core/user/domain/exceptions/weak-password.exception';

type ExceptionMapping = { statusCode: number; message?: string };

export const ExceptionHttpMapper = new Map<
  new (...args: any[]) => DomainException,
  ExceptionMapping
>([
  [EmailAlreadyExistsException, { statusCode: 422 }],
  [InvalidCredentialsException, { statusCode: 401 }],
  [UserNotFoundException, { statusCode: 404 }],
  [SessionNotFoundException, { statusCode: 401 }],
  [WeakPasswordException, { statusCode: 422 }],
]);
