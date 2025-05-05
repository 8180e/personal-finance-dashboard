/// <reference types="../../src/types/user" />
import { UserRepository } from "../../src/repositories/user.repository";
import { ConflictError } from "../../src/utils/errors.util";

export class FakeUserRepository implements UserRepository {
  private users: (InputUser & OutputUser)[] = [];

  create = async (user: InputUser) => {
    const createdUser = { ...user, id: this.users.length.toString() };

    if (this.users.find((u) => u.email === user.email)) {
      throw new ConflictError("User already exists");
    }

    this.users.push(createdUser);
    return { ...createdUser, password: undefined };
  };

  findByEmail = async (email: string) =>
    this.users.find((u) => u.email === email) || null;
}
