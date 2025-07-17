import { SessionRepository } from '@core/user/domain/repositories/session.repository';
import { Session } from '@core/user/domain/entities/session';

export class DestroySessionInteractor {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(session: Session): Promise<void> {
    const sessionId = session.getId();

    if (typeof sessionId === 'string') {
      await this.sessionRepository.delete(sessionId);
    }

    return;
  }
}
