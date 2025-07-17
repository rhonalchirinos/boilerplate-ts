export class User {
  private constructor(
    private id: string,
    private email: string,
    private name: string,
    private password: string,
  ) {}

  static create(params: { id?: string; email: string; name: string; password: string }): User {
    return new User(params.id!, params.email, params.name, params.password);
  }

  changePassword(newPassword: string): void {
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    this.password = newPassword;
  }

  rename(newName: string): void {
    if (!newName.trim()) {
      throw new Error('Name cannot be empty');
    }

    this.name = newName;
  }

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getName(): string {
    return this.name;
  }

  getPassword(): string {
    return this.password;
  }

  setId(id: string): void {
    this.id = id;
  }

  toJSON(): object {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
    };
  }
}
