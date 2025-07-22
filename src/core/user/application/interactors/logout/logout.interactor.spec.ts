import { LogoutInteractor } from './logout.interactor';
import { SessionRepository } from '@core/user/domain/repositories/session.repository';
import { Session } from '@core/user/domain/entities/session';

describe('LogoutInteractor', () => {
  let sessionRepository: SessionRepository;
  let logoutInteractor: LogoutInteractor;

  beforeEach(() => {
    sessionRepository = {
      delete: jest.fn(),
    } as unknown as SessionRepository;
    logoutInteractor = new LogoutInteractor(sessionRepository);
  });

  it('should call sessionRepository.delete with session id if id is string', async () => {
    const session = Session.create({ id: '12345' });
    const deleteSpy = jest.spyOn(sessionRepository, 'delete');
    await logoutInteractor.execute(session);
    expect(deleteSpy).toHaveBeenCalledWith('12345');
  });
});
