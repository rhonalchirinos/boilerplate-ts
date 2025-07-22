import { PrismaService } from '@app/config/database/infra/prisma.service';
import { DeviceRepository } from '@core/user/domain/repositories/device.repository';
import { DeviceMapper } from '../mappers/device.mapper';
import { Injectable } from '@nestjs/common';
import { Device } from '@core/user/domain/entities/device';

@Injectable()
export class PrismaDeviceRepository implements DeviceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Device | null> {
    const device = await this.prisma.device.findUnique({ where: { id } });

    if (!device) return null;

    return DeviceMapper.toDomain(device);
  }

  async findByDevice(
    userId: string,
    arg?: Partial<Pick<Device, 'ip' | 'userAgent' | 'platform' | 'browser' | 'osVersion'>>,
  ): Promise<Device | null> {
    const device = await this.prisma.device.findFirst({
      where: {
        userId,
        ip: arg?.ip,
        userAgent: arg?.userAgent,
        platform: arg?.platform,
        browser: arg?.browser,
        osVersion: arg?.osVersion,
      },
    });

    if (!device) return null;

    return DeviceMapper.toDomain(device);
  }

  async create(device: Device): Promise<Device> {
    const created = await this.prisma.device.create({
      data: {
        userId: device.getUserId(),
        ip: device.getIp()!,
        userAgent: device.getUserAgent()!,
        platform: device.getPlatform()!,
        browser: device.getBrowser()!,
        osVersion: device.getOsVersion()!,
        createdAt: device.getCreatedAt()!,
      },
    });

    return DeviceMapper.toDomain(created);
  }

  async update(device: Device): Promise<Device> {
    await this.prisma.device.update({
      where: { id: device.getId() },
      data: {
        userId: device.getUserId(),
        ip: device.getIp()!,
        userAgent: device.getUserAgent()!,
        platform: device.getPlatform()!,
        browser: device.getBrowser()!,
        osVersion: device.getOsVersion()!,
        createdAt: device.getCreatedAt()!,
      },
    });

    return device;
  }

  async save(device: Device): Promise<Device> {
    if (device.getId()) {
      return this.update(device);
    }

    return this.create(device);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.device.delete({ where: { id } });
  }
}
