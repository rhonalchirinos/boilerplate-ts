import { PrismaService } from '@app/config/database/infra/prisma.service';
import { Session } from '@core/user/domain/entities/session';
import { SessionRepository } from '@core/user/domain/repositories/session.repository';
import { Injectable } from '@nestjs/common';
import { SessionMapper } from '../mappers/session.mapper';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Session | null> {
    const session = await this.prisma.session.findUnique({ where: { id } });

    if (!session) return null;

    return SessionMapper.toDomain(session);
  }

  async create(session: Session): Promise<Session> {
    const created = await this.prisma.session.create({
      data: {
        userId: session.getUserId(),
        refresh: session.getRefreshToken(),
        sub: session.getSub(),
      },
    });

    return SessionMapper.toDomain(created);
  }

  async update(session: Session): Promise<Session> {
    await this.prisma.session.update({
      where: { id: session.getId() },
      data: {
        userId: session.getUserId(),
        refresh: session.getRefreshToken(),
        expiresAt: session.getExpiresAt(),
      },
    });

    return session;
  }

  async save(session: Session): Promise<Session> {
    if (session.getId()) {
      return this.update(session);
    }

    return this.create(session);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.session.delete({ where: { id } });
  }

  async findBySub(sub: string): Promise<Session | null> {
    const session = await this.prisma.session.findFirst({
      where: { sub },
    });

    if (!session) return null;

    return SessionMapper.toDomain(session);
  }
}
