import { verifyJWT } from "@/http/middlewares";
import { create } from "domain";
import { FastifyInstance } from "fastify";
import { validate } from "./validate";
import { history } from "./history";
import { metrics } from "./metrics";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/check-ins/history", history);
  app.get("/check-ins/metrics", metrics);

  app.post("/check-ins", create);
  app.patch("/check-ins/:checkInId/validate", validate);
}
