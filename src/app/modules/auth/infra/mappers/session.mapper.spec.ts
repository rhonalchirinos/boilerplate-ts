import { SessionMapper } from './session.mapper';
import { Session } from '@core/user/domain/entities/session';

describe('SessionMapper', () => {
  const prismaSession = {
    id: 'sess1',
    userId: 'user1',
    sub: 'sub1',
    refresh: 'refresh-token',
    expiresAt: new Date('2023-01-02'),
    createdAt: new Date('2023-01-01'),
    deviceId: 'dev1',
  };

  it('should map prisma session to domain', () => {
    const domain = SessionMapper.toDomain(prismaSession);
    expect(domain.getId()).toBe(prismaSession.id);
    expect(domain.getUserId()).toBe(prismaSession.userId);
    expect(domain.getSub()).toBe(prismaSession.sub);
    expect(domain.getRefresh()).toBe(prismaSession.refresh);
    expect(domain.getExpiresAt()).toEqual(prismaSession.expiresAt);
    expect(domain.getCreatedAt()).toEqual(prismaSession.createdAt);
  });

  it('should map domain session to persistence', () => {
    const domain = Session.create(prismaSession);
    const persistence = SessionMapper.toPersistence(domain);
    expect(persistence).toEqual(prismaSession);
  });
});
