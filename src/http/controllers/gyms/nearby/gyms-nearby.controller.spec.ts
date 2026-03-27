import request from "supertest";
import { app } from "@/app";

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test";

describe("Gyms Nearby Controller", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list nearby gyms", async () => {
    const { token, user } = await createAndAuthenticateUser(app);

    const nearbyGym = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: `Nearby Gym`,
        description: null,
        latitude: -6.256922,
        longitude: -36.52182,
        phone: null,
      });

    const distantGym = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: `Distant Gym`,
        description: null,
        latitude: 0,
        longitude: 0,
        phone: null,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -6.256922,
        longitude: -36.52182,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Nearby Gym",
      }),
    ]);
  });
});
