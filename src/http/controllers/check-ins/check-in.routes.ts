import { verifyJWT, verifyUserRole } from "@/http/middlewares";
import { FastifyInstance } from "fastify";
import { validate } from "./validate";
import { history } from "./history";
import { metrics } from "./metrics";
import { create } from "./create";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/check-ins/history", history);
  app.get("/check-ins/metrics", metrics);

  app.post("/check-ins", create);
  app.patch(
    "/check-ins/:checkInId/validate",
    { onRequest: [verifyUserRole("ADMIN")] },
    validate,
  );
}
