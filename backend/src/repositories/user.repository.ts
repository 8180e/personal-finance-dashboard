export interface UserRepository {
  create: (user: InputUser) => Promise<OutputUser>;
  findByEmail: (
    email: string
  ) => Promise<(OutputUser & { password: string }) | null>;
}
