import { DomainException } from '../../../shared/domain.exception';

export class InvalidCredentialsException extends DomainException {
  constructor(message: string = 'Credenciales inválidas.') {
    super(message, 'InvalidCredentialsException');
  }
}
