import { vi, describe, it, expect } from "vitest";
import { Result, validationResult } from "express-validator";
import validationErrorHandler from "../../../src/middlewares/validation/validationErrorHandler.middleware";
import { Request, Response } from "express";
import { BadRequestError } from "../../../src/utils/errors.util";

vi.mock("express-validator");

describe("validationErrorHandler", () => {
  it("calls next if no errors", () => {
    const mockNext = vi.fn();

    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => true,
    } as Result);

    validationErrorHandler({} as Request, {} as Response, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("throws BadRequestError if errors", () => {
    const mockNext = vi.fn();

    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "error" }],
    } as Result);

    validationErrorHandler({} as Request, {} as Response, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new BadRequestError("error"));
  });
});
