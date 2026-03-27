import request from "supertest";
import { app } from "@/app";

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test";

describe("Create Gym Controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gym", async () => {
    const { token, user } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Gym",
        description: "Gym to test e2e",
        phone: "5584999999999",
        latitude: -6.2609587,
        longitude: -36.5221023,
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.gym).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });
});
