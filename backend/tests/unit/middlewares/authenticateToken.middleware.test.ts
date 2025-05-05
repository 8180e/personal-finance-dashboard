/// <reference types="../../../src/types/express" />
import { describe, it, vi, expect } from "vitest";
import { Request, Response } from "express";
import authenticateToken from "../../../src/middlewares/authenticateToken.middleware";
import { UnauthorizedError } from "../../../src/utils/errors.util";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../../../src/config/env.config";

describe("authenticateToken", () => {
  it("throws UnauthorizedError if no token is provided", () => {
    const req = { headers: {} } as Request;
    const res = {} as Response;
    const next = vi.fn();

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new UnauthorizedError("No token provided")
    );
  });

  it("throws UnauthorizedError if token is invalid", () => {
    const req = {
      headers: { authorization: "Bearer invalid_token" },
    } as Request;
    const res = {} as Response;
    const next = vi.fn();

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new UnauthorizedError("Invalid or expired token")
    );
  });

  it("calls next if token is valid", () => {
    const user = { id: "1", name: "John Doe", email: "johndoe@example.com" };
    const token = jwt.sign(user, TOKEN_SECRET, { expiresIn: "1d" });
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as Request;
    const res = {} as Response;
    const next = vi.fn();

    authenticateToken(req, res, next);

    expect(req.user).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
    expect(next).toHaveBeenCalledWith();
  });
});
