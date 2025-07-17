import { SessionRepository } from '@core/user/domain/repositories/session.repository';
import { Session } from '@core/user/domain/entities/session';
import { SessionNotFoundException } from '@core/user/domain/exceptions/session-not-found.exception';

export class LoadSessionInteractor {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(sub: string): Promise<Session> {
    const session = await this.sessionRepository.findBySub(sub);

    if (!session) throw new SessionNotFoundException('not authenticated');

    return session;
  }
}
