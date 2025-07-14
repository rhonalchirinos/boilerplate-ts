export class InvalidCredentialsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Invalid Credentials Exception';
  }

  toJSON() {
    return {
      message: this.message,
    };
  }
}
