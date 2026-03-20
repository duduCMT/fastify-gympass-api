import { randomUUID } from "node:crypto";
import { CheckInsRepository } from "../@types/check-ins.repository";
import { CheckIn, CheckInUncheckedCreateInput } from "@/@types";

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
}
