import { randomUUID } from "node:crypto";
import { Gym, GymCreateInput } from "@/@types";
import { GymsRepository } from "../@types/gyms.repository";
import { Decimal } from "@prisma/client/runtime";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id);
    return gym || null;
  }

  async create(data: GymCreateInput) {
    const gym: Gym = {
      id: randomUUID(),
      created_at: new Date(),
      description: data.description ?? null,
      title: data.title,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      phone: data.phone ?? null,
      updated_at: new Date(),
    };

    this.items.push(gym);

    return gym;
  }

  async searchMany(query: string, page: number, limit = 20): Promise<Gym[]> {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * limit, page * limit);
  }
}
