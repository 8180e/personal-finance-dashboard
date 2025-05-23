export interface HashingWrapper {
  hashPassword: (password: string) => Promise<string>;
  comparePassword: (
    password: string,
    hashedPassword: string
  ) => Promise<boolean>;
}
