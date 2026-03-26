import { PrismaGymsRepository } from "@/repositories";
import { FetchNearbyGymsUseCase } from "@/use-cases";

export const makeFetchNearbyGymsUseCase = () => {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new FetchNearbyGymsUseCase(gymsRepository);

  return useCase;
};
