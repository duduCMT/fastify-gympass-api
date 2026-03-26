import { makeGetUserMetricsUseCase } from "@/use-cases";
import { FastifyRequest, FastifyReply } from "fastify";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase();
  const { checkInsCount } = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ checkInsCount });
}
