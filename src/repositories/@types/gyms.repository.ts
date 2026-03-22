import { Gym, GymCreateInput, GymUncheckedCreateInput } from "@/@types";

export interface GymsRepository {
  findById(gymId: string): Promise<Gym | null>;
  create(gym: GymCreateInput): Promise<Gym>;
}
