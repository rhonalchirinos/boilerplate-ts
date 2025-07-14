import { PrismaService } from '@app/config/database/infra/prisma.service';
import { User } from '@core/user/domain/entities/user';
import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return new User({
      id: '' + user.id,
      email: user.email,
      name: user.name ?? '',
      password: user.password ?? '',
    });
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

    return new User({
      id: '' + user.id,
      email: user.email,
      name: user.name ?? '',
      password: user.password ?? '',
    });
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email.toLocaleLowerCase(),
        name: user.name,
        password: user.password,
      },
    });

    user.id = '' + createdUser.id;

    return user;
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

  async update(user: User): Promise<User> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        password: user.password,
      },
    });

    return user;
  }

  async save(user: User): Promise<User> {
    const exists = await this.findById(user.id);

    if (exists) {
      return this.update(user);
    }

    return this.create(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
