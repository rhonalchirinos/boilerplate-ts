import { PrismaDeviceRepository } from './prima-device.rapository';
import { PrismaService } from '@app/config/database/infra/prisma.service';
import { DeviceMapper } from '../mappers/device.mapper';
import * as prisma from 'generated/prisma';
import { Device } from '@core/user/domain/entities/device';

jest.mock('generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    device: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  })),
}));

describe('PrismaDeviceRepository', () => {
  let prismaService: PrismaService;
  let repo: PrismaDeviceRepository;
  let device: Device;
  let prismaDevice: prisma.Device;

  beforeEach(() => {
    prismaService = new PrismaService();
    repo = new PrismaDeviceRepository(prismaService);
    device = Device.create({
      id: '1',
      userId: 'user1',
      ip: '127.0.0.1',
      userAgent: 'agent',
      platform: 'web',
      browser: 'chrome',
      osVersion: '1.0',
      createdAt: new Date(),
    });
    prismaDevice = {
      id: '1',
      userId: 'user1',
      ip: '127.0.0.1',
      userAgent: 'agent',
      platform: 'web',
      browser: 'chrome',
      osVersion: '1.0',
      createdAt: new Date(),
    } as prisma.Device;
  });

  it('findById returns mapped device', async () => {
    const findUniqueSpy = jest
      .spyOn(prismaService.device, 'findUnique')
      .mockResolvedValue(prismaDevice);
    const result = await repo.findById('1');
    expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBeInstanceOf(Device);
    expect(result).toMatchObject({
      id: '1',
      userId: 'user1',
      ip: '127.0.0.1',
      userAgent: 'agent',
      platform: 'web',
      browser: 'chrome',
      osVersion: '1.0',
      createdAt: expect.any(Date) as Date,
    });
  });

  it('findById returns null if not found', async () => {
    const findUniqueSpy = jest.spyOn(prismaService.device, 'findUnique').mockResolvedValue(null);
    const result = await repo.findById('1');
    expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBeNull();
  });

  it('findByDevice returns mapped device', async () => {
    const findFirstSpy = jest
      .spyOn(prismaService.device, 'findFirst')
      .mockResolvedValue(prismaDevice);
    const result = await repo.findByDevice('user1', {
      ip: '127.0.0.1',
      userAgent: 'agent',
      platform: 'web',
      browser: 'chrome',
      osVersion: '1.0',
    });
    expect(findFirstSpy).toHaveBeenCalledWith({
      where: {
        userId: 'user1',
        ip: '127.0.0.1',
        userAgent: 'agent',
        platform: 'web',
        browser: 'chrome',
        osVersion: '1.0',
      },
    });
    expect(result).toMatchObject({
      ...DeviceMapper.toDomain(prismaDevice),
      createdAt: expect.any(Date) as Date,
    });
  });

  it('findByDevice returns null if not found', async () => {
    const findFirstSpy = jest.spyOn(prismaService.device, 'findFirst').mockResolvedValue(null);
    const result = await repo.findByDevice('user1', {
      ip: '127.0.0.1',
    });
    expect(findFirstSpy).toHaveBeenCalledWith({
      where: {
        userId: 'user1',
        ip: '127.0.0.1',
      },
    });
    expect(result).toBeNull();
  });

  it('create calls prisma and maps result', async () => {
    const createSpy = jest.spyOn(prismaService.device, 'create').mockResolvedValue(prismaDevice);
    const result = await repo.create(device);
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        userId: device.getUserId(),
        ip: device.getIp(),
        userAgent: device.getUserAgent(),
        platform: device.getPlatform(),
        browser: device.getBrowser(),
        osVersion: device.getOsVersion(),
        createdAt: device.getCreatedAt(),
      },
    });
    expect(result).toMatchObject({
      id: '1',
      userId: 'user1',
      ip: '127.0.0.1',
      userAgent: 'agent',
      platform: 'web',
      browser: 'chrome',
      osVersion: '1.0',
      createdAt: expect.any(Date) as Date,
    });
  });

  it('update calls prisma and returns device', async () => {
    const updateSpy = jest.spyOn(prismaService.device, 'update').mockResolvedValue(prismaDevice);
    const result = await repo.update(device);
    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: '1' },
      data: {
        userId: 'user1',
        ip: '127.0.0.1',
        userAgent: 'agent',
        platform: 'web',
        browser: 'chrome',
        osVersion: '1.0',
        createdAt: device.getCreatedAt(),
      },
    });
    expect(result).toBe(device);
  });

  it('save calls update if device has id', async () => {
    const updateSpy = jest.spyOn(repo, 'update').mockResolvedValue(device);
    const result = await repo.save(device);
    expect(updateSpy).toHaveBeenCalledWith(device);
    expect(result).toBe(device);
  });

  it('save calls create if device has no id', async () => {
    const deviceWithoutId = Device.create({
      id: undefined,
      userId: 'user1',
      ip: '127.0.0.1',
      userAgent: 'agent',
      platform: 'web',
      browser: 'chrome',
      osVersion: '1.0',
      createdAt: new Date(),
    });
    const createSpy = jest.spyOn(repo, 'create').mockResolvedValue(deviceWithoutId);
    const result = await repo.save(deviceWithoutId);
    expect(createSpy).toHaveBeenCalledWith(deviceWithoutId);
    expect(result).toBe(deviceWithoutId);
  });

  it('delete calls prisma delete', async () => {
    const deleteSpy = jest.spyOn(prismaService.device, 'delete').mockResolvedValue(prismaDevice);
    await repo.delete('1');
    expect(deleteSpy).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
