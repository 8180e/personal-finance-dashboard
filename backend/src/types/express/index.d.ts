import _express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: OutputUser;
    }
  }
}
