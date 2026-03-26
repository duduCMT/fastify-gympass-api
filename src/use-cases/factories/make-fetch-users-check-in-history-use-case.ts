import { PrismaCheckInsRepository } from "@/repositories";
import { FetchUserCheckInsHistoryUseCase } from "@/use-cases";

export const makeFetchUserCheckInsHistoryUseCase = () => {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository);

  return useCase;
};
