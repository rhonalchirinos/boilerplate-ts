import { LoginValidationPipe } from './login-validation.pipe';
import { LoginDto } from '../../controllers/dto/login.dto';

describe('LoginValidationPipe', () => {
  let pipe: LoginValidationPipe;

  beforeEach(() => {
    pipe = new LoginValidationPipe();
  });

  it('should validate a valid login DTO', async () => {
    const dto: LoginDto = {
      email: 'test@example.com',
      password: 'StrongP@ssw0rd',
    };
    await expect(pipe.transform(dto)).resolves.toEqual(dto);
  });

  it('should throw error for invalid email', async () => {
    const dto: LoginDto = {
      email: 'invalid-email',
      password: 'StrongP@ssw0rd',
    };
    await expect(pipe.transform(dto)).rejects.toThrow();
  });

  it('should throw error for short password', async () => {
    const dto: LoginDto = {
      email: 'test@example.com',
      password: 'short',
    };
    await expect(pipe.transform(dto)).rejects.toThrow();
  });
});
