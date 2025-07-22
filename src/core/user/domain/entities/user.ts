export class User {
  private constructor(
    private readonly id: string,
    private email: string,
    private name: string,
    private password: string,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date | null = null,
  ) {}

  static create(params: {
    id?: string;
    email?: string;
    name?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date | null;
  }): User {
    return new User(
      params.id!,
      params?.email ?? '',
      params?.name ?? '',
      params?.password ?? '',
      params?.createdAt ?? new Date(),
      params?.updatedAt ?? null,
    );
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

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date | null {
    return this.updatedAt;
  }

  setEmail(email: string): void {
    this.email = email.toLowerCase();
  }

  setName(name: string): void {
    this.name = name;
  }

  toJSON(): object {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
    };
  }
}
