import { Session } from '../entities/session';

export interface SessionRepository {
  findById(id: string): Promise<Session | null>;
  findBySub(sub: string): Promise<Session | null>;
  save(session: Session): Promise<Session>;
  delete(id: string): Promise<void>;
}
