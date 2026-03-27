import request from "supertest";
import { app } from "@/app";

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test";

describe("Create Check-In Controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a check-in", async () => {
    const { token, user } = await createAndAuthenticateUser(app);

    const gymResponse = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Gym",
        description: "Gym to test e2e",
        phone: "5584999999999",
        latitude: -6.256922,
        longitude: -36.52182,
      });

    const response = await request(app.server)
      .post(`/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: user.id,
        gymId: gymResponse.body.gym.id,
        latitude: -6.256922,
        longitude: -36.52182,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIn).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });
});
