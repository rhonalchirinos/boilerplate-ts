import { User } from '@core/user/domain/entities/user';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  existsEmail(email: string): Promise<boolean>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
