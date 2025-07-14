export class UnAuthorizedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedException';
  }

  toJSON() {
    return {
      message: this.message,
    };
  }
}
