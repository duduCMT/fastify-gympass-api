import request from "supertest";

import { FastifyInstance } from "fastify";
import { User } from "@/@types";

export async function createAndAuthenticateUser(app: FastifyInstance) {
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
