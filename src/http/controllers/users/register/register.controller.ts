import { UserAlreadyExistsError } from "@/use-cases";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();
    const { user } = await registerUseCase.execute({ name, email, password });
    return reply
      .status(201)
      .send({ user: { ...user, password_hash: undefined } });
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    throw err;
  }
}
