import { SignupValidationPipe } from './signup-validation.pipe';
import { SignupUserDTO } from '../../controllers/dto/signup.dto';

describe('SignupValidationPipe', () => {
  let pipe: SignupValidationPipe;

  beforeEach(() => {
    pipe = new SignupValidationPipe();
  });

  it('should validate a valid signup DTO', () => {
    const dto: SignupUserDTO = {
      email: 'test@example.com',
      password: 'StrongP@ssw0rd',
    };
    return expect(pipe.transform(dto)).resolves.toEqual(dto);
  });

  it('should throw error for weak password', () => {
    const dto: SignupUserDTO = {
      email: 'test@example.com',
      password: 'weak',
    };
    return expect(pipe.transform(dto)).rejects.toThrow();
  });

  it('should throw error for missing special character', () => {
    const dto: SignupUserDTO = {
      email: 'test@example.com',
      password: 'StrongPass1',
    };
    return expect(pipe.transform(dto)).rejects.toThrow();
  });

  it('should throw error for missing uppercase letter', () => {
    const dto: SignupUserDTO = {
      email: 'test@example.com',
      password: 'strongp@ss1',
    };
    return expect(pipe.transform(dto)).rejects.toThrow();
  });

  it('should throw error for missing lowercase letter', () => {
    const dto: SignupUserDTO = {
      email: 'test@example.com',
      password: 'STRONGP@SS1',
    };
    return expect(pipe.transform(dto)).rejects.toThrow();
  });

  it('should throw error for missing number', () => {
    const dto: SignupUserDTO = {
      email: 'test@example.com',
      password: 'StrongP@ss',
    };
    return expect(pipe.transform(dto)).rejects.toThrow();
  });

  it('should throw error for invalid email', () => {
    const dto: SignupUserDTO = {
      email: 'invalid-email',
      password: 'StrongP@ssw0rd',
    };
    return expect(pipe.transform(dto)).rejects.toThrow();
  });
});
