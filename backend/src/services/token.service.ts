import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/env.config.js";
import { UnauthorizedError } from "../utils/errors.util.js";

export class TokenService {
  generateToken = (user: OutputUser) =>
    jwt.sign(user, TOKEN_SECRET, { expiresIn: "1d" });
  getUserFromToken = (token: string) => {
    try {
      return jwt.verify(token, TOKEN_SECRET) as OutputUser;
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }
  };
}
