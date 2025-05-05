import { UserRepository } from "../repositories/user.repository.js";
import { HashingWrapper } from "../wrappers/hashing.wrapper.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors.util.js";

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private hasher: HashingWrapper
  ) {}

  createUser = async (user: InputUser) => {
    const hashedPassword = await this.hasher.hashPassword(user.password);
    return await this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
  };

  authenticateUser = async (email: string, password: string) => {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isValidPassword = await this.hasher.comparePassword(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid password");
    }

    return { ...user, password: undefined };
  };
}
