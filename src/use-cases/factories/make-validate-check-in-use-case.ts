import { PrismaCheckInsRepository } from "@/repositories";
import { ValidateCheckInUseCase } from "@/use-cases";

export const makeValidateCheckInUseCase = () => {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new ValidateCheckInUseCase(checkInsRepository);

  return useCase;
};
