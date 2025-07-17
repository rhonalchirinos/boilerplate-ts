import { DomainException } from '@core/shared/domain.exception';

export class SessionNotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
