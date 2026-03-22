import { randomUUID } from "node:crypto";
import { CheckInsRepository } from "../@types/check-ins.repository";
import { CheckIn, CheckInUncheckedCreateInput } from "@/@types";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async create(data: CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      gym_id: data.gym_id,
      user_id: data.user_id,
      id: randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
      validated_at: data.validated_at
        ? new Date(data.validated_at)
        : new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const statOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(statOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDate) {
      return null;
    }

    return checkInOnSameDate;
  }

  async findManyByUserId(
    userId: string,
    page: number,
  ): Promise<CheckIn[] | null> {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }
}
