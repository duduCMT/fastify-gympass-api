import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { makeCreateCheckInUseCase } from "@/use-cases";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
    gymId: z.string().uuid(),
    userId: z.string().uuid(),
  });

  const { latitude, longitude, gymId, userId } = createCheckInBodySchema.parse(
    request.body,
  );

  const createCheckInUseCase = makeCreateCheckInUseCase();
  const { checkIn } = await createCheckInUseCase.execute({
    gymId,
    userId,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({ checkIn });
}
