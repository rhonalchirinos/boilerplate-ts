export type AccessTokenDto = {
  token: string;
  refresh?: string;
  expiresAt?: Date;
};
