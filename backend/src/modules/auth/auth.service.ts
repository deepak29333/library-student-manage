import { UserRepository } from '../user/user.repository';
import { comparePassword } from '../../utils/hash.util';
import { signToken } from '../../utils/jwt.util';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user) {
      const err = new Error('Invalid email or password') as Error & { status: number };
      err.status = 401;
      throw err;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid email or password') as Error & { status: number };
      err.status = 401;
      throw err;
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      libraryId: user.libraryId,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        libraryId: user.libraryId,
      },
    };
  }
}
