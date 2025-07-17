import { JwtUserPayload } from '@core/user/application/dto/access-token.dto';
import { JwtTokenGenerator } from './jwt-token-generator';
import { JwtService } from '@nestjs/jwt';

describe('JwtTokenGenerator', () => {
  let jwtService: jest.Mocked<JwtService>;
  let generator: JwtTokenGenerator;

  const mockPayload: JwtUserPayload = { userId: '123' };
  const mockToken = 'mocked.jwt.token';

  beforeEach(() => {
    jwtService = {
      signAsync: jest.fn().mockResolvedValue(mockToken),
    } as unknown as jest.Mocked<JwtService>;

    generator = new JwtTokenGenerator(jwtService);
  });

  it('should create a token with correct structure', async () => {
    const expiresIn = 3600;
    const result = await generator.create(mockPayload, expiresIn);

    expect(result).toHaveProperty('sub');
    expect(result).toHaveProperty('token', mockToken);
    expect(result).toHaveProperty('expiresAt');
  });

  it('should create a refresh token with 8 days expiration', async () => {
    const result = await generator.refreshToken(mockPayload);
    expect(result).toHaveProperty('token', mockToken);
  });

  it('should create an access token with 7 days expiration', async () => {
    const result = await generator.token(mockPayload);

    expect(result).toHaveProperty('token', mockToken);
  });
});
