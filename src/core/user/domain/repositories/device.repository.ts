import { Device } from '@core/user/domain/entities/device';

export interface DeviceRepository {
  findById(id: string): Promise<Device | null>;
  findByDevice(
    userId: string,
    arg?: Partial<Pick<Device, 'ip' | 'userAgent' | 'platform' | 'browser' | 'osVersion'>>,
  ): Promise<Device | null>;
  save(device: Device): Promise<Device>;
  delete(id: string): Promise<void>;
}
