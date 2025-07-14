import { PrismaService } from '@app/config/database/services/prisma.service';
import { User } from '@core/user/domain/entities/user';
import { PrismaUserRepository } from './prisma-user.repository';

jest.mock('generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => {
    return {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    };
  }),
}));

describe('PrismaUserRepository', () => {
  let prisma: PrismaService;
  let repository: PrismaUserRepository;

  beforeEach(() => {
    prisma = new PrismaService();
    repository = new PrismaUserRepository(prisma);
  });

  it('should find user by id', async () => {
    const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique');
    findUniqueSpy.mockResolvedValue({
      id: '1',
      email: 'a@b.com',
      name: 'A',
      password: 'pass',
    });

    const user = await repository.findById('1');
    expect(user).toBeInstanceOf(User);
    expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(user?.id).toBe('1');
  });

  it('should return null if user not found by id', async () => {
    const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique');
    findUniqueSpy.mockResolvedValue(null);
    const user = await repository.findById('2');
    expect(user).toBeNull();
  });

  it('should find user by email', async () => {
    const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique');
    findUniqueSpy.mockResolvedValue({
      id: '1',
      email: 'a@b.com',
      name: 'A',
      password: 'pass',
    });
    const user = await repository.findByEmail('a@b.com');
    expect(user).toBeInstanceOf(User);
    expect(user?.email).toBe('a@b.com');
  });

  it('should return null if user not found by email', async () => {
    const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique');
    findUniqueSpy.mockResolvedValue(null);
    const user = await repository.findByEmail('notfound@b.com');
    expect(user).toBeNull();
  });

  it('should create a user', async () => {
    const user = new User({ id: '', email: 'a@b.com', name: 'A', password: 'pass' });
    const createSpy = jest.spyOn(prisma.user, 'create');
    createSpy.mockResolvedValue({
      id: '1',
      email: 'a@b.com',
      name: 'A',
      password: 'pass',
    });
    const created = await repository.create(user);
    expect(created.id).toBe('1');
    expect(createSpy).toHaveBeenCalled();
  });

  it('should check if email exists', async () => {
    const countSpy = jest.spyOn(prisma.user, 'count');
    countSpy.mockResolvedValue(1);
    const exists = await repository.existsEmail('a@b.com');
    expect(exists).toBe(true);
  });

  it('should update a user', async () => {
    const user = new User({ id: '1', email: 'a@b.com', name: 'A', password: 'pass' });
    const updateSpyOn = jest.spyOn(prisma.user, 'update');
    updateSpyOn.mockResolvedValue({
      id: '1',
      email: 'a@b.com',
      name: 'A',
      password: 'pass',
    });
    const updated = await repository.update(user);
    expect(updated).toBe(user);
    expect(updateSpyOn).toHaveBeenCalled();
  });

  it('should save (update) if user exists', async () => {
    const user = new User({ id: '1', email: 'a@b.com', name: 'A', password: 'pass' });
    jest.spyOn(repository, 'findById').mockResolvedValue(user);
    jest.spyOn(repository, 'update').mockResolvedValue(user);
    const saved = await repository.save(user);
    expect(saved).toBe(user);
  });

  it('should save (create) if user does not exist', async () => {
    const user = new User({ id: '', email: 'a@b.com', name: 'A', password: 'pass' });
    jest.spyOn(repository, 'findById').mockResolvedValue(null);
    jest.spyOn(repository, 'create').mockResolvedValue(user);
    const saved = await repository.save(user);
    expect(saved).toBe(user);
  });

  it('should delete a user', async () => {
    const deleteSpyOn = jest.spyOn(prisma.user, 'delete');
    deleteSpyOn.mockResolvedValue({
      id: '1',
      email: 'a@b.com',
      name: 'A',
      password: 'pass',
    });
    await repository.delete('1');
    expect(deleteSpyOn).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
