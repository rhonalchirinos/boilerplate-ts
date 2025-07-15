import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginInteractor } from '@core/user/application/interactors/login.interactor';
import { SignupInteractor } from '@core/user/application/interactors/signup.interactor';
import { AccessTokenDto } from '@core/user/application/dto/access-token.dto';
import { InvalidCredentialsException } from '@core/user/domain/exceptions/invalid-credentials.exception';
import { ErrorDTO } from '@shared/utils/format-error';
import { BusinessExceptionFilter } from '@app/filters/business-exception.filter';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let mockLoginInteractor: jest.Mocked<LoginInteractor>;
  let mockSignupInteractor: jest.Mocked<SignupInteractor>;

  beforeAll(async () => {
    mockLoginInteractor = { execute: jest.fn() } as unknown as jest.Mocked<LoginInteractor>;
    mockSignupInteractor = { execute: jest.fn() } as unknown as jest.Mocked<SignupInteractor>;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginInteractor.name,
          useValue: mockLoginInteractor,
        },
        {
          provide: SignupInteractor.name,
          useValue: mockSignupInteractor,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalFilters(new BusinessExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should return access token if login is successful', async () => {
      const body = { email: 'test@example.com', password: 'password123' };
      const accessToken: AccessTokenDto = { token: 'token' };

      const executeMock = jest.spyOn(mockLoginInteractor, 'execute');
      executeMock.mockResolvedValue(accessToken);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(body)
        .expect(201);

      expect(executeMock).toHaveBeenCalledWith(body.email, body.password);
      expect(response.body).toEqual(accessToken);
    });

    it('should return 401 if login fails', async () => {
      const body = { email: 'fail@example.com', password: 'wrongpass' };

      const error = new InvalidCredentialsException('Invalid credentials');

      const executeMock = jest.spyOn(mockLoginInteractor, 'execute');
      executeMock.mockRejectedValue(error);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(body)
        .expect(401);

      const bodyResponse = response.body as ErrorDTO;
      expect(bodyResponse.message).toBe('Invalid credentials');
    });

    it('should return 422 if validation fails (invalid email)', async () => {
      const invalidBody = { email: 'not-an-email', password: 'password123' };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidBody)
        .expect(422);

      const bodyResponse = response.body as ErrorDTO;
      expect(bodyResponse.message).toBeDefined();
    });
  });

  describe('/auth/signup (POST)', () => {
    it('should return access token if signup is successful', async () => {
      const body = { email: 'signup@example.com', password: 'signup@Pass123' };
      const accessToken: AccessTokenDto = { token: 'signup-token' };

      const executeMock = jest.spyOn(mockSignupInteractor, 'execute');
      executeMock.mockResolvedValue(accessToken);

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(body)
        .expect(201);

      expect(executeMock).toHaveBeenCalledWith(body.email, body.password);
      expect(response.body).toEqual(accessToken);
    });

    it('should return 422 if signup fails', async () => {
      const body = { email: 'fail@example.com', password: 'wrongpass' };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(body)
        .expect(422);
      console.error(response.body);
      const bodyResponse = response.body as ErrorDTO;
      expect(bodyResponse.message).toBe('Invalid signup credentials');
      expect(bodyResponse.errors).toBeDefined();
      expect(bodyResponse.errors).toEqual([
        {
          field: 'password',
          error: 'Password must contain at least one uppercase letter',
        },
        {
          field: 'password',
          error: 'Password must contain at least one number',
        },
        {
          field: 'password',
          error: 'Password must contain at least one special character',
        },
      ]);
    });

    it('should return 422 if validation fails (invalid email)', async () => {
      const invalidBody = { email: 'not-an-email', password: 'signupPass123' };
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(invalidBody)
        .expect(422);

      const bodyResponse = response.body as ErrorDTO;
      expect(bodyResponse.message).toBeDefined();
    });
  });
});
