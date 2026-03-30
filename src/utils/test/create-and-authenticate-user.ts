import request from "supertest";

import { FastifyInstance } from "fastify";
import { User } from "@/@types";
import { prisma } from "@/lib/prisma";

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  role: User["role"] = "MEMBER",
) {
  const user = {
    name: "John Due",
    email: "johndue@exemple.com",
    password: "123456",
  };

  const userResponse = await request(app.server).post("/users").send({
    name: user.name,
    email: user.email,
    password: user.password,
  });

  await prisma.user.update({
    where: {
      id: userResponse.body.user.id,
    },
    data: {
      role,
    },
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: user.email,
    password: user.password,
  });

  const token = authResponse.body.token as string;

  return {
    token,
    user: userResponse.body.user as Omit<User, "password_hash">,
    authResponse,
  };
}
