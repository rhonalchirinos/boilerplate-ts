import { AccessTokenDto } from '../dto/access-token.dto';

export interface TokenGenerator {
  generate(payload: Record<string, unknown>): Promise<AccessTokenDto>;
  generateRefreshToken(payload: Record<string, unknown>): Promise<string>;
}
