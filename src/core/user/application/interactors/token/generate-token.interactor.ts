import { Session } from '@core/user/domain/entities/session';
import { AccessTokenDTO, TokenDTO } from '@core/user/application/dto/access-token.dto';
import { TokenGenerator } from '@core/user/application/services/token-generator.service';
import { User } from '@core/user/domain/entities/user';
import { DeviceRepository } from '@core/user/domain/repositories/device.repository';
import { Device } from '@core/user/domain/entities/device';
import { SessionRepository } from '@core/user/domain/repositories/session.repository';

export class GenerateTokenInteractor {
  prisma: any;
  constructor(
    protected readonly tokenGenerator: TokenGenerator,
    protected readonly deviceRepository: DeviceRepository,
    protected readonly sessionRepository: SessionRepository,
  ) {}

  public async generateSession(
    userId: string,
    arg?: Partial<Pick<Device, 'ip' | 'userAgent' | 'platform' | 'browser' | 'osVersion'>>,
  ): Promise<{ session: Session; token: TokenDTO; refresh: TokenDTO }> {
    const token = await this.tokenGenerator.token({ userId });
    const refreshToken = await this.tokenGenerator.refreshToken({ userId });
    const deviceInfo = await this.deviceRepository.findByDevice(userId, {
      ip: arg?.ip,
      userAgent: arg?.userAgent,
      platform: arg?.platform,
      browser: arg?.browser,
      osVersion: arg?.osVersion,
    });

    let deviceData: Device | null = deviceInfo;

    if (!deviceInfo) {
      deviceData = await this.deviceRepository.save(
        Device.create({
          ...{ userId },
          ip: arg?.ip,
          userAgent: arg?.userAgent,
          platform: arg?.platform,
          browser: arg?.browser,
          osVersion: arg?.osVersion,
        }),
      );
    }

    const session = await this.sessionRepository.save(
      Session.create({
        sub: token.sub,
        userId,
        refresh: refreshToken.sub,
        expiresAt: token.expiresAt!,
        deviceId: deviceData?.getId(),
      }),
    );

    return { session, token, refresh: refreshToken };
  }

  accessTokenToJson(user: User, token: TokenDTO, refresh: TokenDTO): AccessTokenDTO {
    return {
      success: true,
      message: 'Token generated successfully',
      data: {
        user: {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
        },
        tokens: {
          accessToken: token.token,
          refreshToken: refresh.token,
        },
      },
      timestamp: new Date().toISOString(),
    };
  }
}
