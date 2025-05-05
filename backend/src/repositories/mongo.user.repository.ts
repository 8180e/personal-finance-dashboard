import { UserRepository } from "./user.repository.js";
import User from "../models/user.model.js";
import { ConflictError } from "../utils/errors.util.js";

export class MongoUserRepository implements UserRepository {
  create = async (user: InputUser) => {
    try {
      const newUser = await User.create(user);
      return newUser.toJSON();
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === 11000) {
        throw new ConflictError("User already exists");
      }
      throw error;
    }
  };
  findByEmail = async (email: string) => {
    const user = await User.findOne({ email });
    return user && {...user.toJSON(), password: user.password};
  };
}
