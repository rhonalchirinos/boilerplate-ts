import { ArgonEncryptionService } from './argon-encryption.service';

describe('ArgonEncryptionService', () => {
  let service: ArgonEncryptionService;

  beforeEach(() => {
    service = new ArgonEncryptionService();
  });

  it('should hash and verify password correctly', async () => {
    const password = 'mySecretPassword';
    const hash = await service.hashPassword(password);
    expect(typeof hash).toBe('string');
    expect(hash).not.toBe(password);
    const isValid = await service.comparePassword(hash, password);
    expect(isValid).toBe(true);
  });

  it('should not verify incorrect password', async () => {
    const password = 'mySecretPassword';
    const wrongPassword = 'wrongPassword';
    const hash = await service.hashPassword(password);
    const isValid = await service.comparePassword(hash, wrongPassword);
    expect(isValid).toBe(false);
  });
});
