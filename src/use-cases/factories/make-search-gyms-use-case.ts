import { PrismaGymsRepository } from "@/repositories";
import { SearchGymUseCase } from "@/use-cases";

export const makeSearchGymsUseCase = () => {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new SearchGymUseCase(gymsRepository);

  return useCase;
};
