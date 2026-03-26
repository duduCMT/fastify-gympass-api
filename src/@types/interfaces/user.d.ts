import { User as UserType, Prisma } from "@prisma/client";

export type User = UserType;

export type UserCreateInput = Prisma.UserCreateInput;
