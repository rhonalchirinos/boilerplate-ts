import { PrismaSessionRepository } from './prisma-session.repository';
import { PrismaService } from '@app/config/database/infra/prisma.service';
import { SessionMapper } from '../mappers/session.mapper';
import * as prisma from 'generated/prisma';
import { Session } from '@core/user/domain/entities/session';

jest.mock('generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => {
    return {
      session: {
        findUnique: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findFirst: jest.fn(), // Add missing findFirst mock
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    };
  }),
}));

describe('PrismaSessionRepository', () => {
  let prisma: PrismaService;
  let repo: PrismaSessionRepository;
  let session: Session;
  let prismaSession: prisma.Session;

  beforeEach(() => {
    prisma = new PrismaService();
    repo = new PrismaSessionRepository(prisma);
    session = Session.create({
      id: '1',
      sub: 'sub',
      refresh: 'refreshToken',
      expiresAt: null,
      userId: 'user1',
      deviceId: 'device1',
    });

    prismaSession = {
      id: '1',
      userId: 'user1',
      refresh: 'refreshToken',
      sub: 'sub',
      expiresAt: null,
      createdAt: null,
      deviceId: null,
    } as prisma.Session;
  });

  it('findById returns mapped session', async () => {
    const findUniqueSpy = jest.spyOn(prisma.session, 'findUnique');
    findUniqueSpy.mockResolvedValue(prismaSession);

    const result = await repo.findById('1');

    expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBeInstanceOf(Session);
    expect(result).toMatchObject({
      id: '1',
      userId: 'user1',
      refresh: 'refreshToken',
      sub: 'sub',
      expiresAt: null,
      createdAt: expect.any(Date) as Date,
      deviceId: undefined,
    });
  });

  it('findById returns null if not found', async () => {
    const findUniqueSpy = jest.spyOn(prisma.session, 'findUnique').mockResolvedValue(null);
    const result = await repo.findById('1');
    expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBeNull();
  });

  it('create calls prisma and maps result', async () => {
    const createSpy = jest.spyOn(prisma.session, 'create').mockResolvedValue(prismaSession);
    const result = await repo.create(session);

    expect(createSpy).toHaveBeenCalledWith({
      data: {
        userId: session.getUserId(),
        refresh: session.getRefresh(),
        sub: session.getSub(),
        deviceId: session.getDeviceId(),
        expiresAt: session.getExpiresAt(),
      },
    });
    expect(result).toMatchObject({
      id: '1',
      userId: 'user1',
      refresh: 'refreshToken',
      sub: 'sub',
      expiresAt: null,
      createdAt: expect.any(Date) as Date,
      deviceId: undefined,
    });
  });

  it('update calls prisma and returns session', async () => {
    const updateSpy = jest.spyOn(prisma.session, 'update').mockResolvedValue(prismaSession);
    const result = await repo.update(session);

    expect(updateSpy).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { userId: 'user1', refresh: 'refreshToken', expiresAt: null },
    });
    expect(result).toBe(session);
  });

  it('save calls update if session has id', async () => {
    jest.spyOn(repo, 'update').mockResolvedValue(session);
    const result = await repo.save(session);
    const updateSpy = jest.spyOn(repo, 'update');

    expect(updateSpy).toHaveBeenCalledWith(session);
    expect(result).toBe(session);
  });

  it('save calls create if session has no id', async () => {
    // Create a session without an id
    const sessionWithoutId = Session.create({
      id: undefined,
      sub: 'sub',
      refresh: 'refreshToken',
      expiresAt: null,
      userId: 'user1',
      deviceId: 'device1',
    });

    jest.spyOn(repo, 'create').mockResolvedValue(sessionWithoutId);
    const result = await repo.save(sessionWithoutId);
    const createSpy = jest.spyOn(repo, 'create');

    expect(createSpy).toHaveBeenCalledWith(sessionWithoutId);
    expect(result).toBe(sessionWithoutId);
  });

  it('delete calls prisma delete', async () => {
    const deleteSpy = jest.spyOn(prisma.session, 'delete');
    await repo.delete('id');
    expect(deleteSpy).toHaveBeenCalledWith({ where: { id: 'id' } });
  });

  it('findBySub returns mapped session', async () => {
    const findFirstSpy = jest.spyOn(prisma.session, 'findFirst');
    findFirstSpy.mockResolvedValue(prismaSession);

    const result = await repo.findBySub('sub');
    expect(findFirstSpy).toHaveBeenCalledWith({ where: { sub: 'sub' } });
    expect(result).toMatchObject({
      ...SessionMapper.toDomain(prismaSession),
      createdAt: expect.any(Date) as Date,
    });
  });

  it('findBySub returns null if not found', async () => {
    const findFirstSpy = jest.spyOn(prisma.session, 'findFirst').mockResolvedValue(null);
    const result = await repo.findBySub('sub');
    expect(findFirstSpy).toHaveBeenCalledWith({ where: { sub: 'sub' } });
    expect(result).toBeNull();
  });
});
