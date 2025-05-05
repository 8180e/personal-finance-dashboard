import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message });
};

export default errorHandler;
