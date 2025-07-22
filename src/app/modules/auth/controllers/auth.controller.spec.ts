import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ErrorDTO } from '@shared/utils/format-error';
import { RequestSession } from '@shared/utils/request-session';
import { LoginInteractor } from '@core/user/application/interactors/login/login.interactor';
import { SignupInteractor } from '@core/user/application/interactors/signup/signup.interactor';
import { AccessTokenDTO } from '@core/user/application/dto/access-token.dto';
import { InvalidCredentialsException } from '@core/user/domain/exceptions/invalid-credentials.exception';
import { BusinessExceptionFilter } from '@app/filters/business-exception.filter';
import { LogoutInteractor } from '@core/user/application/interactors/logout/logout.interactor';
import { Session } from '@core/user/domain/entities/session';
import { JwtAuthGuard } from '@app/modules/auth/infra/jwt/auth/jwt-auth.guard';

import * as request from 'supertest';
import { App } from 'supertest/types';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let mockLoginInteractor: jest.Mocked<LoginInteractor>;
  let mockSignupInteractor: jest.Mocked<SignupInteractor>;
  let mockLogoutInteractor: jest.Mocked<LogoutInteractor>;

  beforeAll(async () => {
    mockLoginInteractor = { execute: jest.fn() } as unknown as jest.Mocked<LoginInteractor>;

    mockSignupInteractor = { execute: jest.fn() } as unknown as jest.Mocked<SignupInteractor>;

    mockLogoutInteractor = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<LogoutInteractor>;

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
        {
          provide: LogoutInteractor.name,
          useValue: mockLogoutInteractor,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn() })
      .compile();

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
      const accessToken: AccessTokenDTO = {
        success: true,
        message: 'Token generated successfully',
        data: {
          user: {
            id: 'be5c84d0-3a8b-474a-8197-821adade19af',
            name: 'Hilda Dicki',
            email: 'ralph.johns45@yahoo.com',
          },
          tokens: {
            accessToken: 'kkcqflKghKzPhpAf5F0nhGc50wabXZO8zWp6CwVTHbE',
            refreshToken: 'LAWrT9tPNHaeiKneDtH6-gT_ESDU-M_NLJUN5dvH-mQ',
          },
        },
        timestamp: '2025-07-17T01:42:42.262Z',
      };
      const executeMock = jest.spyOn(mockLoginInteractor, 'execute');
      executeMock.mockResolvedValue(accessToken);
      const response = await request(app.getHttpServer() as App)
        .post('/auth/login')
        .send(body)
        .expect(201);
      expect(executeMock).toHaveBeenCalledWith(body.email, body.password, {
        ip: expect.any(String) as string,
        userAgent: undefined,
      });
      expect(response.body).toEqual(accessToken);
    });

    it('should return 401 if login fails', async () => {
      const body = { email: 'fail@example.com', password: 'wrongpass' };
      const error = new InvalidCredentialsException('Invalid credentials');
      const executeMock = jest.spyOn(mockLoginInteractor, 'execute');
      executeMock.mockRejectedValue(error);

      const response = await request(app.getHttpServer() as App)
        .post('/auth/login')
        .send(body)
        .expect(401);

      const bodyResponse = response.body as ErrorDTO;
      expect(bodyResponse.message).toBe('Invalid credentials');
    });

    it('should return 422 if validation fails (invalid email)', async () => {
      const invalidBody = { email: 'not-an-email', password: 'password123' };
      const response = await request(app.getHttpServer() as App)
        .post('/auth/login')
        .send(invalidBody)
        .expect(422);
      const bodyResponse = response.body as ErrorDTO;
      expect(bodyResponse.message).toBeDefined();
    });
  });

  describe('/auth/signup (POST)', () => {
    it('should return 201 if signup is successful', async () => {
      const body = { email: 'signup@example.com', password: 'signup@Pass123', name: 'Hilda Dicki' };
      const accessToken: AccessTokenDTO = {
        success: true,
        message: 'Token generated successfully',
        data: {
          user: {
            id: 'be5c84d0-3a8b-474a-8197-821adade19af',
            name: 'Hilda Dicki',
            email: 'ralph.johns45@yahoo.com',
          },
          tokens: {
            accessToken: 'kkcqflKghKzPhpAf5F0nhGc50wabXZO8zWp6CwVTHbE',
            refreshToken: 'LAWrT9tPNHaeiKneDtH6-gT_ESDU-M_NLJUN5dvH-mQ',
          },
        },
        timestamp: '2025-07-17T01:42:42.262Z',
      };
      const executeMock = jest.spyOn(mockSignupInteractor, 'execute');
      executeMock.mockResolvedValue(accessToken);
      const response = await request(app.getHttpServer() as App)
        .post('/auth/signup')
        .send(body)
        .expect(201);
      expect(executeMock).toHaveBeenCalledWith(body.email, body.password, body.name, {
        ip: expect.any(String) as string,
        userAgent: undefined,
      });
      expect(response.body).toEqual(accessToken);
    });

    it('should return 422 if signup fails', async () => {
      const body = { email: 'fail@example.com', password: 'wrongpass', name: 'Hilda Dicki' };
      // Mock the interactor to throw an error with the expected structure
      const error = {
        status: 422,
        message: 'Invalid signup credentials',
        errors: [
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
        ],
      };
      const executeMock = jest.spyOn(mockSignupInteractor, 'execute');
      executeMock.mockRejectedValue(error);
      const response = await request(app.getHttpServer() as App)
        .post('/auth/signup')
        .send(body)
        .expect(422);
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
      const response = await request(app.getHttpServer() as App)
        .post('/auth/signup')
        .send(invalidBody)
        .expect(422);
      const bodyResponse = response.body as ErrorDTO;
      expect(bodyResponse.message).toBeDefined();
    });
  });

  describe('/auth/logout (DELETE)', () => {
    it('should destroy the session and return 204', async () => {
      const session = Session.create({
        id: 'session-id',
        sub: 'user-sub',
        userId: 'user-id',
        refresh: 'refresh-token',
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
        createdAt: new Date(),
      });
      const guard = app.get(JwtAuthGuard);
      jest.spyOn(guard, 'canActivate').mockImplementation((context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<RequestSession>();
        request.user = session;
        return true;
      });
      const destroySessionSpy = jest.spyOn(mockLogoutInteractor, 'execute');
      await request(app.getHttpServer() as App)
        .delete('/auth/logout')
        .expect(204);
      expect(destroySessionSpy).toHaveBeenCalledWith(session);
    });
    it('should return 401 if user is not authenticated', async () => {
      const guard = app.get(JwtAuthGuard);
      jest.spyOn(guard, 'canActivate').mockImplementation(() => {
        throw new UnauthorizedException();
      });
      await request(app.getHttpServer() as App)
        .delete('/auth/logout')
        .expect(401);
    });
  });
});
