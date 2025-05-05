import { describe, it, expect } from "vitest";
import { FakeUserRepository } from "../../mocks/fake.user.repository";
import { FakeHashingWrapper } from "../../mocks/fake.hashing.wrapper";
import { UserService } from "../../../src/services/user.service";
import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from "../../../src/utils/errors.util";

describe("createUser", () => {
  it("creates a user", async () => {
    const userRepository = new FakeUserRepository();
    const hasher = new FakeHashingWrapper();
    const userService = new UserService(userRepository, hasher);

    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };
    const user2 = {
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "password",
    };

    const createdUser = await userService.createUser(user);
    const createdUser2 = await userService.createUser(user2);

    expect(createdUser).toEqual({
      id: "0",
      name: "John Doe",
      email: "johndoe@example.com",
    });
    expect(createdUser2).toEqual({
      id: "1",
      name: "Jane Doe",
      email: "janedoe@example.com",
    });
  });

  it("throws an error if user already exists", async () => {
    const userRepository = new FakeUserRepository();
    const hasher = new FakeHashingWrapper();
    const userService = new UserService(userRepository, hasher);

    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };

    await userService.createUser(user);
    await expect(userService.createUser(user)).rejects.toThrow(ConflictError);
  });
});

describe("authenticateUser", () => {
  it("authenticates a user", async () => {
    const userRepository = new FakeUserRepository();
    const hasher = new FakeHashingWrapper();
    const userService = new UserService(userRepository, hasher);

    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };
    const user2 = {
      name: "Jane Doe",
      email: "janedoe@example.com",
      password: "password",
    };

    await userService.createUser(user);
    await userService.createUser(user2);

    const authenticatedUser = await userService.authenticateUser(
      user.email,
      user.password
    );
    const authenticatedUser2 = await userService.authenticateUser(
      user2.email,
      user2.password
    );

    expect(authenticatedUser).toEqual({
      id: "0",
      name: "John Doe",
      email: "johndoe@example.com",
    });
    expect(authenticatedUser2).toEqual({
      id: "1",
      name: "Jane Doe",
      email: "janedoe@example.com",
    });
  });

  it("throws an error if user does not exist", async () => {
    const userRepository = new FakeUserRepository();
    const hasher = new FakeHashingWrapper();
    const userService = new UserService(userRepository, hasher);

    await expect(
      userService.authenticateUser("johndoe@example.com", "password")
    ).rejects.toThrow(NotFoundError);
  });

  it("throws an error if password is incorrect", async () => {
    const userRepository = new FakeUserRepository();
    const hasher = new FakeHashingWrapper();
    const userService = new UserService(userRepository, hasher);

    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };

    await userService.createUser(user);

    await expect(
      userService.authenticateUser(user.email, "wrong-password")
    ).rejects.toThrow(UnauthorizedError);
  });
});
