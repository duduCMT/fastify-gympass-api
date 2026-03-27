import request from "supertest";
import { app } from "@/app";

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test";

describe("Search Gyms Controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search a gym", async () => {
    const { token, user } = await createAndAuthenticateUser(app);

    const gym01 = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Gym 01",
        description: "Gym to test e2e",
        phone: "5584999999999",
        latitude: -6.2609587,
        longitude: -36.5221023,
      });

    const gym02 = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Gym 02",
        description: "Gym to test e2e",
        phone: "5584999999999",
        latitude: -6.2609587,
        longitude: -36.5221023,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        q: "02",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Test Gym 02",
      }),
    ]);
  });
});
