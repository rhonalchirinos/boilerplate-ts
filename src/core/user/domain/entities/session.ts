export class Session {
  constructor(
    private id: string | undefined = undefined,
    private sub: string,
    private userId: string,
    private refreshToken: string,
    private expiresAt: Date | null,
    private readonly createdAt: Date = new Date(),
  ) {}

  isExpired(): boolean {
    return this.expiresAt ? this.expiresAt < new Date() : false;
  }

  renew(sub: string, refreshToken: string, expiresAt: Date): void {
    this.sub = sub;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;
  }

  getId(): string | undefined {
    return this.id;
  }

  getSub() {
    return this.sub;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  getExpiresAt() {
    return this.expiresAt;
  }

  getUserId() {
    return this.userId;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken;
  }

  setExpiresAt(expiresAt: Date | null): void {
    this.expiresAt = expiresAt;
  }

  static create(params: {
    id?: string;
    sub?: string;
    refresh?: string;
    expiresAt?: Date | null;
    userId?: string;
    createdAt?: Date;
  }): Session {
    return new Session(
      params.id,
      params.sub!,
      params.userId!,
      params.refresh!,
      params.expiresAt!,
      params.createdAt,
    );
  }
}
