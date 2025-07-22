import { LoadSessionInteractor } from './load-session.interactor';
import { SessionRepository } from '@core/user/domain/repositories/session.repository';
import { Session } from '@core/user/domain/entities/session';
import { SessionNotFoundException } from '@core/user/domain/exceptions/session-not-found.exception';

describe('LoadSessionInteractor', () => {
  let sessionRepository: jest.Mocked<SessionRepository>;
  let interactor: LoadSessionInteractor;

  beforeEach(() => {
    sessionRepository = {
      findById: jest.fn(),
      findBySub: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SessionRepository>;
    interactor = new LoadSessionInteractor(sessionRepository);
  });

  it('should return a session when found', async () => {
    const sub = 'user-123';
    const session = Session.create({ sub });

    const sessionSpy = jest.spyOn(sessionRepository, 'findBySub');
    sessionSpy.mockResolvedValue(session);

    const result = await interactor.execute(sub);
    expect(result).toBe(session);
    expect(sessionSpy).toHaveBeenCalledWith(sub);
  });

  it('should throw SessionNotFoundException when session not found', async () => {
    const sub = 'user-456';

    const sessionSpy = jest.spyOn(sessionRepository, 'findBySub').mockResolvedValue(null);

    await expect(interactor.execute(sub)).rejects.toThrow(SessionNotFoundException);
    expect(sessionSpy).toHaveBeenCalledWith(sub);
  });
});
