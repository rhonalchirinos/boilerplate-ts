export class DomainException extends Error {
  constructor(message: string, name?: string) {
    super(message);
    this.name = name || 'DomainException';
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      message: this.message,
    };
  }
}
