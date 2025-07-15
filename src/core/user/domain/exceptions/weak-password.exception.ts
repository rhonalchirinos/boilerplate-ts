import { DomainException } from '../../../shared/domain.exception';

export class WeakPasswordException extends DomainException {
  constructor(message: string = 'La contraseña no es lo suficientemente fuerte.') {
    super(message, 'WeakPasswordException');
  }
}
