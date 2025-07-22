import { DeviceMapper } from './device.mapper';
import { Device } from '@core/user/domain/entities/device';

describe('DeviceMapper', () => {
  const prismaDevice = {
    id: 'dev1',
    userId: 'user1',
    ip: '127.0.0.1',
    userAgent: 'agent',
    platform: 'web',
    browser: 'chrome',
    osVersion: '1.0',
    createdAt: new Date('2023-01-01'),
  };

  it('should map prisma device to domain', () => {
    const domain = DeviceMapper.toDomain(prismaDevice);
    expect(domain.getId()).toBe(prismaDevice.id);
    expect(domain.getUserId()).toBe(prismaDevice.userId);
    expect(domain.getIp()).toBe(prismaDevice.ip);
    expect(domain.getUserAgent()).toBe(prismaDevice.userAgent);
    expect(domain.getPlatform()).toBe(prismaDevice.platform);
    expect(domain.getBrowser()).toBe(prismaDevice.browser);
    expect(domain.getOsVersion()).toBe(prismaDevice.osVersion);
    expect(domain.getCreatedAt()).toEqual(prismaDevice.createdAt);
  });

  it('should map domain device to persistence', () => {
    const domain = Device.create(prismaDevice);
    const persistence = DeviceMapper.toPersistence(domain);
    expect(persistence).toEqual(prismaDevice);
  });
});
