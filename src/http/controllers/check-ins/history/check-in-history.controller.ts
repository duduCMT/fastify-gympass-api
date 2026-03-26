import {
  makeFetchUserCheckInsHistoryUseCase,
  makeSearchGymsUseCase,
} from "@/use-cases";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = searchGymQuerySchema.parse(request.query);

  const fetchUseCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();
  const { checkIns } = await fetchUseCheckInsHistoryUseCase.execute({
    page,
    userId: request.user.sub,
  });

  return reply.status(200).send({ checkIns, page });
}
