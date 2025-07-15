import { DomainException } from '../../../shared/domain.exception';

export class EmailAlreadyExistsException extends DomainException {
  constructor(message: string = 'El email ya está registrado.') {
    super(message, 'EmailAlreadyExistsException');
  }
}
