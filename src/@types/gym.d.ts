import { Gym as GymType, Prisma } from "@prisma/client";

export type Gym = GymType;

export type GymCreateInput = Prisma.GymCreateInput;

export type GymUncheckedCreateInput = Prisma.GymUncheckedCreateInput;
