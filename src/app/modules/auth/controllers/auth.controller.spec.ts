import { AuthController } from './auth.controller';
import { LoginInteractor } from '@core/user/application/interactors/login.interactor';
import { SignupInteractor } from '@core/user/application/interactors/signup.interactor';
import { AccessTokenDto } from '@core/user/application/dto/access-token.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockLoginInteractor = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<LoginInteractor>;
  const mockSignupInteractor = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<SignupInteractor>;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(mockLoginInteractor, mockSignupInteractor);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call loginInteractor.execute with email and password and return access token', async () => {
      const body = { email: 'test@example.com', password: 'password123' };
      const accessToken: AccessTokenDto = { token: 'token' };
      mockLoginInteractor.execute.mockResolvedValue(accessToken);
      const accessTokenSpy = jest.spyOn(mockLoginInteractor, 'execute');
      const result = await controller.login(body);

      expect(accessTokenSpy).toHaveBeenCalledWith(body.email, body.password);
      expect(result).toBe(accessToken);
    });
  });

  describe('signup', () => {
    it('should call signupInteractor.execute with email and password and return access token', async () => {
      const body = { email: 'signup@example.com', password: 'signupPass123' };
      const accessToken: AccessTokenDto = { token: 'signup-token' };
      mockSignupInteractor.execute.mockResolvedValue(accessToken);
      const accessTokenSpy = jest.spyOn(mockSignupInteractor, 'execute');
      const result = await controller.signup(body);

      expect(accessTokenSpy).toHaveBeenCalledWith(body.email, body.password);
      expect(result).toBe(accessToken);
    });
  });
});
