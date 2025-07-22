import { UserMapper } from './user.mapper';
import { User } from '@core/user/domain/entities/user';

describe('UserMapper', () => {
  const prismaUser = {
    id: 'user1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
  };

  it('should map prisma user to domain', () => {
    const domain = UserMapper.toDomain(prismaUser);
    expect(domain.getId()).toBe(prismaUser.id);
    expect(domain.getEmail()).toBe(prismaUser.email);
    expect(domain.getName()).toBe(prismaUser.name);
    expect(domain.getPassword()).toBe(prismaUser.password);
    expect(domain.getCreatedAt()).toEqual(prismaUser.createdAt);
    expect(domain.getUpdatedAt()).toEqual(prismaUser.updatedAt);
  });

  it('should map domain user to persistence', () => {
    const domain = User.create(prismaUser);
    const persistence = UserMapper.toPersistence(domain);
    expect(persistence).toEqual({
      ...prismaUser,
      email: prismaUser.email.toLocaleLowerCase(),
      name: prismaUser.name,
      password: prismaUser.password,
    });
  });
});
