import { prisma } from "@/lib/prisma";
import { CheckIn, CheckInUncheckedCreateInput } from "@/@types";
import { CheckInsRepository } from "@/repositories";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });
    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const statOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: statOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    });

    return checkIn;
  }

  async findManyByUserId(
    userId: string,
    page: number,
  ): Promise<CheckIn[] | null> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkIns;
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    });
    return count;
  }
  async create(data: CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id: data.gym_id,
        user_id: data.user_id,
        validated_at: null,
      },
    });

    return checkIn;
  }
  async save(data: CheckIn): Promise<CheckIn> {
    const updatedCheckIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data: {
        gym_id: data.gym_id,
        user_id: data.user_id,
        validated_at: data.validated_at,
      },
    });

    return updatedCheckIn;
  }
}
