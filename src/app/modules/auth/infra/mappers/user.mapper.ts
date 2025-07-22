import { User } from '@core/user/domain/entities/user';
import * as prisma from 'generated/prisma';

export class UserMapper {
  static toDomain(user: prisma.User): User {
    return User.create({
      id: user.id,
      email: user.email,
      name: user.name ?? '',
      password: user.password ?? '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? null,
    });
  }

  static toPersistence(user: User): prisma.User {
    return {
      id: user.getId(),
      email: user.getEmail().toLocaleLowerCase(),
      name: user.getName() || null,
      password: user.getPassword() || null,
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
