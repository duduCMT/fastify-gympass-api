import { PrismaUsersRepository } from "@/repositories";
import { GetUserProfileUseCase } from "@/use-cases";

export const makeGetUserProfileUseCase = () => {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCase(usersRepository);

  return useCase;
};
