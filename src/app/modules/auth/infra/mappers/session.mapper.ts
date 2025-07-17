import { Session } from '@core/user/domain/entities/session';
import * as prisma from 'generated/prisma';

export class SessionMapper {
  static toDomain(session: prisma.Session): Session {
    return Session.create({
      id: session.id ?? '',
      sub: session.sub,
      userId: session.userId,
      refresh: session.refresh,
      expiresAt: session.expiresAt!,
      createdAt: session.createdAt!,
    });
  }

  static toPersistence(session: Session): prisma.Session {
    return {
      id: session.getId() ?? '',
      userId: session.getUserId() ?? '',
      refresh: session.getRefreshToken() ?? '',
      sub: session.getSub() ?? '',
      expiresAt: session.getExpiresAt() ?? null,
      createdAt: session.getCreatedAt() ?? new Date(),
    };
  }
}
