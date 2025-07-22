import { Device } from '@core/user/domain/entities/device';
import * as prisma from 'generated/prisma';

export class DeviceMapper {
  static toDomain(device: prisma.Device): Device {
    return Device.create({
      id: device.id,
      userId: device.userId,
      ip: device.ip!,
      userAgent: device.userAgent!,
      platform: device.platform!,
      browser: device.browser!,
      osVersion: device.osVersion!,
      createdAt: device.createdAt || new Date(),
    });
  }

  static toPersistence(device: Device): prisma.Device {
    return {
      id: device.getId(),
      userId: device.getUserId(),
      ip: device.getIp()!,
      userAgent: device.getUserAgent()!,
      platform: device.getPlatform()!,
      browser: device.getBrowser()!,
      osVersion: device.getOsVersion()!,
      createdAt: device.getCreatedAt()!,
    };
  }
}
