import { PrismaService } from '@app/config/database/infra/prisma.service';
import { User } from '@core/user/domain/entities/user';
import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';

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

    return User.create({
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

    return User.create({
      id: '' + user.id,
      email: user.email,
      name: user.name ?? '',
      password: user.password ?? '',
    });
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
      data: {
        email: user.getEmail().toLocaleLowerCase(),
        name: user.getName(),
        password: user.getPassword(),
      },
    });

    user.setId(createdUser.id);

    return user;
  }

  async update(user: User): Promise<User> {
    await this.prisma.user.update({
      where: { id: user.getId() },
      data: {
        name: user.getName(),
        password: user.getPassword(),
      },
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
