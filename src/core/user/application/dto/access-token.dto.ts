export type TokenDTO = {
  token: string;
  sub: string;
  expiresAt?: Date;
};

export type JwtUserPayload = {
  userId: string;
  sub?: string;
};

export type AccessTokenDTO = {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  timestamp: string;
};
