import { User, UserCreateInput } from "@/@types";

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: UserCreateInput): Promise<User>;
}
