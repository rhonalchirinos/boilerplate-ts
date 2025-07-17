import { DomainException } from '@core/shared/domain.exception';

export class UserNotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
