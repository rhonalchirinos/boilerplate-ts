import { ExceptionHttpMapper } from './exception.mapper';
import { EmailAlreadyExistsException } from '@core/user/domain/exceptions/email-already-exists.exception';
import { InvalidCredentialsException } from '@core/user/domain/exceptions/invalid-credentials.exception';
import { SessionNotFoundException } from '@core/user/domain/exceptions/session-not-found.exception';
import { UserNotFoundException } from '@core/user/domain/exceptions/user-not-found.exception';
import { WeakPasswordException } from '@core/user/domain/exceptions/weak-password.exception';
import { DomainException } from '@core/shared/domain.exception';

describe('ExceptionHttpMapper', () => {
  it('should map EmailAlreadyExistsException to status 422', () => {
    const mapping = ExceptionHttpMapper.get(EmailAlreadyExistsException);
    expect(mapping).toEqual({ statusCode: 422 });
  });

  it('should map InvalidCredentialsException to status 401', () => {
    const mapping = ExceptionHttpMapper.get(InvalidCredentialsException);
    expect(mapping).toEqual({ statusCode: 401 });
  });

  it('should map UserNotFoundException to status 404', () => {
    const mapping = ExceptionHttpMapper.get(UserNotFoundException);
    expect(mapping).toEqual({ statusCode: 404 });
  });

  it('should map SessionNotFoundException to status 401', () => {
    const mapping = ExceptionHttpMapper.get(SessionNotFoundException);
    expect(mapping).toEqual({ statusCode: 401 });
  });

  it('should map WeakPasswordException to status 422', () => {
    const mapping = ExceptionHttpMapper.get(WeakPasswordException);
    expect(mapping).toEqual({ statusCode: 422 });
  });

  it('should return undefined for unmapped exception', () => {
    class UnmappedException extends DomainException {
      constructor() {
        super('Unmapped');
      }
      toJSON() {
        return { message: this.message };
      }
    }
    const mapping = ExceptionHttpMapper.get(UnmappedException);
    expect(mapping).toBeUndefined();
  });
});
