import { PrismaCheckInsRepository, PrismaGymsRepository } from "@/repositories";
import { CreateCheckIn } from "@/use-cases";

export const makeCreateCheckInUseCase = () => {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CreateCheckIn(checkInsRepository, gymsRepository);

  return useCase;
};
