import { PrismaService } from '@app/config/database/infra/prisma.service';
import { User } from '@core/user/domain/entities/user';
import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email.trim().toLocaleLowerCase(),
      },
    });

    if (!user) {
      return null;
    }
    return UserMapper.toDomain(user);
  }

  async existsEmail(email: string): Promise<boolean> {
    if (!email || email.trim() === '') {
      return false;
    }
    const userExists = await this.prisma.user.count({
      where: {
        email: email.toLocaleLowerCase().trim(),
      },
    });
    return userExists > 0;
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: UserMapper.toPersistence(user),
    });

    return UserMapper.toDomain(createdUser);
  }

  async update(user: User): Promise<User> {
    await this.prisma.user.update({
      where: { id: user.getId() },
      data: UserMapper.toPersistence(user),
    });

    return user;
  }

  async save(user: User): Promise<User> {
    if (user.getId()) {
      return this.update(user);
    }

    return this.create(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
