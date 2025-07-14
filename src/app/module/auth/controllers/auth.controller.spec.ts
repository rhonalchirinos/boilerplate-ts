import { AuthController } from './auth.controller';
import { LoginInteractor } from '@core/user/application/interactors/login.interactor';
import { AccessTokenDto } from '@core/user/application/dto/access-token.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockLoginInteractor = {
    execute: jest.fn(),
  } as unknown as jest.Mocked<LoginInteractor>;

  beforeEach(() => {
    controller = new AuthController(mockLoginInteractor);
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
});
