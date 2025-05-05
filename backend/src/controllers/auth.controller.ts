import { MongoUserRepository } from "../repositories/mongo.user.repository.js";
import { BcryptHashingWrapper } from "../wrappers/bcrypt.hashing.wrapper.js";
import { UserService } from "../services/user.service.js";
import { TokenService } from "../services/token.service.js";
import { Request, Response, NextFunction } from "express";

const userRepository = new MongoUserRepository();
const hasher = new BcryptHashingWrapper();
const userService = new UserService(userRepository, hasher);
const tokenService = new TokenService();

const signup = async (
  { body: credentials }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.createUser(credentials);
    const token = tokenService.generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

const signin = async (
  { body: { email, password } }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.authenticateUser(email, password);
    const token = tokenService.generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export { signup, signin };
