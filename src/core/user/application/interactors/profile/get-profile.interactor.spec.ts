import { GetProfileInteractor } from './get-profile.interactor';
import { UserRepository } from '@core/user/domain/repositories/user.repository';
import { User } from '@core/user/domain/entities/user';
import { UserNotFoundException } from '@core/user/domain/exceptions/user-not-found.exception';

describe('GetProfileInteractor', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let interactor: GetProfileInteractor;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      existsEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    interactor = new GetProfileInteractor(userRepository);
  });

  it('should return user when found', async () => {
    const user = User.create({
      id: '1',
      email: 'test@example.com',
      name: 'Test',
      password: 'password123',
    });
    const spy = jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
    const result = await interactor.execute('1');
    expect(result).toBe(user);
    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should throw UserNotFoundException when user not found', async () => {
    const spy = jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
    await expect(interactor.execute('2')).rejects.toThrow(UserNotFoundException);
    expect(spy).toHaveBeenCalledWith('2');
  });
});
