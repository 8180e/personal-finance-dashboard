import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { BadRequestError } from "../../utils/errors.util.js";

const validationErrorHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new BadRequestError(result.array()[0].msg);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validationErrorHandler;
