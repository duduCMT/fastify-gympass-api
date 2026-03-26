import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares";

import { register } from "./register";
import { authenticate } from "./authenticate";
import { me } from "./me";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  /** Authenticated */
  app.get("/me", { onRequest: [verifyJWT] }, me);
}
