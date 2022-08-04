// eslint-disable-next-line max-classes-per-file
export class ProfileError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}
export class AuthError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  statusCode: number;

  constructor(message : string) {
    super(message);
    this.statusCode = 409;
  }
}
