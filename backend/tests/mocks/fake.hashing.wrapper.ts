import { HashingWrapper } from "../../src/wrappers/hashing.wrapper";

export class FakeHashingWrapper implements HashingWrapper {
  hashPassword = async (password: string) => password;
  comparePassword = async (password: string, hashedPassword: string) =>
    password === hashedPassword;
}
