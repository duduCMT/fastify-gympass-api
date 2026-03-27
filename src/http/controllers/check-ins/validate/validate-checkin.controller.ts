import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { makeValidateCheckInUseCase } from "@/use-cases";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = paramsSchema.parse(request.params);

  const createCheckInUseCase = makeValidateCheckInUseCase();
  const { checkIn } = await createCheckInUseCase.execute({
    checkInId,
  });

  return reply.status(200).send({ checkIn });
}
