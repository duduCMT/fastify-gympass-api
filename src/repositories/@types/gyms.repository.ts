import { Gym, GymCreateInput, GymUncheckedCreateInput } from "@/@types";

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export interface GymsRepository {
  findById(gymId: string): Promise<Gym | null>;
  create(gym: GymCreateInput): Promise<Gym>;
  searchMany(query: string, page: number, limit?: number): Promise<Gym[]>;
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>;
}
