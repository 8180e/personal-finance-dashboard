import { TokenService } from "../services/token.service.js";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/errors.util.js";

const tokenService = new TokenService();

const authenticateToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const user = tokenService.getUserFromToken(token);
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticateToken;
