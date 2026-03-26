import { CheckIn } from "@/@types";
import { CheckInsRepository } from "@/repositories/@types/check-ins.repository";
import { GymsRepository } from "@/repositories/@types/gyms.repository";
import {
  MaxDistanceError,
  MaxNumberOfCheckInsError,
  ResourceNotFoundError,
} from "../errors";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

interface CreateCheckInRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CreateCheckInResponse {
  checkIn: CheckIn;
}

export class CreateCheckIn {
  constructor(
    private checkInRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CreateCheckInRequest): Promise<CreateCheckInResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError();
    }

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
