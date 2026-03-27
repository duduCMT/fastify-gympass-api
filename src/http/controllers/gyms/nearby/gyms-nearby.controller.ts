import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { makeFetchNearbyGymsUseCase } from "@/use-cases";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query);

  const fetchNearbyUseCase = makeFetchNearbyGymsUseCase();
  const { gyms } = await fetchNearbyUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({ gyms });
}
