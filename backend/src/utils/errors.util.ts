class BadRequestError extends Error {
  statusCode = 400;

  constructor(message: string) {
    super(message);
  }
}

class UnauthorizedError extends Error {
  statusCode = 401;

  constructor(message: string) {
    super(message);
  }
}

class NotFoundError extends Error {
  statusCode = 404;

  constructor(message: string) {
    super(message);
  }
}

class ConflictError extends Error {
  statusCode = 409;

  constructor(message: string) {
    super(message);
  }
}

export { BadRequestError, UnauthorizedError, NotFoundError, ConflictError };
