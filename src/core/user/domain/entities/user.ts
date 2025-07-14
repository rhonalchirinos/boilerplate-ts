export class User {
  private _id: string;
  private _email: string;
  private _name: string;
  private _password: string;

  constructor(args: Partial<User> = {}) {
    this._id = args?.id || '';
    this._email = args?.email || '';
    this._name = args?.name || '';
    this._password = args?.password || '';
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  toJSON(): object {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      password: this._password,
    };
  }
}
