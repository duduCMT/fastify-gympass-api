import { PrismaGymsRepository } from "@/repositories";
import { CreateGymUseCase } from "@/use-cases";

export const makeCreateGymUseCase = () => {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CreateGymUseCase(gymsRepository);

  return useCase;
};
