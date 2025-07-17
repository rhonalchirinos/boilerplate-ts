import { JwtUserPayload, TokenDTO } from '../dto/access-token.dto';

export interface TokenGenerator {
  token(payload: JwtUserPayload): Promise<TokenDTO>;
  refreshToken(payload: JwtUserPayload): Promise<TokenDTO>;
  create(payload: JwtUserPayload, expiresInSeconds: number): Promise<TokenDTO>;
}
