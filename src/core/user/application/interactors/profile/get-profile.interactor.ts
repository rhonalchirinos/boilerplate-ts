import { User } from '@core/user/domain/entities/user';
import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { UserNotFoundException } from '@core/user/domain/exceptions/user-not-found.exception';

export class GetProfileInteractor {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException('User not found');
    }

    return user;
  }
}
