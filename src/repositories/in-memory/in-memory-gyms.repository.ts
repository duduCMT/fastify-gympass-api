import { randomUUID } from "node:crypto";
import { Gym, GymCreateInput } from "@/@types";
import { GymsRepository } from "../@types/gyms.repository";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id);
    return gym || null;
  }

  // async create(data: GymCreateInput) {
  //   const gym: Gym = {
  //     id: randomUUID(),
  //     created_at: new Date(),
  //     description: data.description ?? null,
  //     latitude: data.latitude,
  //     longitude: data.longitude,
  //     phone: data.phone
  //   };

  //   this.items.push(user);

  //   return user;
  // }
}
