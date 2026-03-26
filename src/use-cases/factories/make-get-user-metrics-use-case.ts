import { PrismaCheckInsRepository } from "@/repositories";
import { GetUserMetricsUseCase } from "@/use-cases";

export const makeGetUserMetricsUseCase = () => {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new GetUserMetricsUseCase(checkInsRepository);

  return useCase;
};
