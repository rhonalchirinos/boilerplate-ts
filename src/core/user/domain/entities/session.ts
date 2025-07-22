export class Session {
  constructor(
    private id: string | undefined = undefined,
    private refresh: string,
    private sub: string,
    private userId: string,
    private expiresAt: Date | null,
    private createdAt: Date = new Date(),
    private deviceId?: string,
  ) {}

  isExpired(): boolean {
    return this.expiresAt ? this.expiresAt < new Date() : false;
  }

  renew(sub: string, refresh: string, expiresAt: Date): void {
    this.sub = sub;
    this.refresh = refresh;
    this.expiresAt = expiresAt;
  }

  getId(): string | undefined {
    return this.id;
  }

  getSub() {
    return this.sub;
  }

  getRefresh() {
    return this.refresh;
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

  getDeviceId() {
    return this.deviceId;
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
    deviceId?: string;
  }): Session {
    return new Session(
      params.id,
      params.refresh!,
      params.sub!,
      params.userId!,
      params.expiresAt!,
      params.createdAt || new Date(),
      params.deviceId,
    );
  }
}
