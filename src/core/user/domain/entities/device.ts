export class Device {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly ip?: string,
    public readonly userAgent?: string,
    public readonly platform?: string,
    public readonly browser?: string,
    public readonly osVersion?: string,
    public readonly createdAt?: Date,
  ) {}

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getIp(): string | undefined {
    return this.ip;
  }

  getUserAgent(): string | undefined {
    return this.userAgent;
  }

  getPlatform(): string | undefined {
    return this.platform;
  }

  getBrowser(): string | undefined {
    return this.browser;
  }

  getOsVersion(): string | undefined {
    return this.osVersion;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  static create(params: {
    id?: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
    platform?: string;
    browser?: string;
    osVersion?: string;
    createdAt?: Date;
  }): Device {
    return new Device(
      params.id!,
      params.userId!,
      params.ip,
      params.userAgent,
      params.platform,
      params.browser,
      params.osVersion,
      params.createdAt || new Date(),
    );
  }

  toJSON(): object {
    return {
      id: this.id,
      userId: this.userId,
      ip: this.ip,
      userAgent: this.userAgent,
      platform: this.platform,
      browser: this.browser,
      osVersion: this.osVersion,
      createdAt: this.createdAt,
    };
  }
}
