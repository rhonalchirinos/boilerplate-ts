import { JwtTokenGenerator } from './jwt-token-generator';
import { JwtService } from '@nestjs/jwt';

jest.mock('@nestjs/jwt', () => ({
  JwtService: jest.fn().mockImplementation(() => ({
    signAsync: jest.fn(),
  })),
}));

describe('JwtTokenGenerator', () => {
  let jwtService: JwtService;
  let generator: JwtTokenGenerator;

  beforeEach(() => {
    jwtService = new JwtService();
    generator = new JwtTokenGenerator(jwtService);
  });

  it('should generate a refresh token', async () => {
    const signAsyncSpyOn = jest.spyOn(jwtService, 'signAsync');
    signAsyncSpyOn.mockResolvedValue('refresh-token');

    const token = await generator.generateRefreshToken({ userId: '1' });
    expect(token).toBe('refresh-token');
    expect(signAsyncSpyOn).toHaveBeenCalled();
  });

  it('should generate an access token and refresh token', async () => {
    const signAsyncSpyOn = jest.spyOn(jwtService, 'signAsync');
    signAsyncSpyOn.mockResolvedValueOnce('access-token').mockResolvedValueOnce('refresh-token');

    const result = await generator.generate({ userId: '1' });
    expect(result.token).toBe('access-token');
    expect(result.refresh).toBe('refresh-token');
    expect(result.expiresAt).toBeInstanceOf(Date);
  });
});
