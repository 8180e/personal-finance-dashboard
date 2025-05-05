import { HashingWrapper } from "./hashing.wrapper.js";
import bcrypt from "bcryptjs";

export class BcryptHashingWrapper implements HashingWrapper {
  hashPassword = async (password: string) => await bcrypt.hash(password, 10);

  comparePassword = async (password: string, hashedPassword: string) =>
    await bcrypt.compare(password, hashedPassword);
}
