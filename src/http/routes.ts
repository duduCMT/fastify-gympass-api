import { FastifyInstance } from "fastify";
import { register, authenticate, me } from "@/http/controllers";
import { verifyJWT } from "@/http/middlewares";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  /** Authenticated */
  app.get("/me", { onRequest: [verifyJWT] }, me);
}
