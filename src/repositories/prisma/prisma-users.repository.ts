import { prisma } from "@/lib/prisma";
import { UsersRepository } from "../@types/users.repository";
import { User, UserCreateInput } from "@/@types";

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async create(data: UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }
}
