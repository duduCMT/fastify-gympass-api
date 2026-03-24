import { Gym, GymCreateInput } from "@/@types";
import { prisma } from "@/lib/prisma";
import { FindManyNearbyParams, GymsRepository } from "@/repositories";

export class PrismaGymsRepository implements GymsRepository {
  async findById(gymId: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id: gymId,
      },
    });

    return gym;
  }
  async create(data: GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data: {
        title: data.title,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
        phone: data.phone,
      },
    });

    return gym;
  }

  async searchMany(query: string, page: number, limit = 20): Promise<Gym[]> {
    const gym = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return gym;
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms 
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms;
  }
}
