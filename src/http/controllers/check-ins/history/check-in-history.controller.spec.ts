import request from "supertest";
import { app } from "@/app";

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test";

describe("Check-In History Controller", () => {
  beforeAll(async () => {
    await app.ready();
    vi.useFakeTimers();
  });

  afterAll(async () => {
    await app.close();
    vi.useRealTimers();
  });

  it("should be able to list the history of check-ins", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

    const { token, user, authResponse } = await createAndAuthenticateUser(app);

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

    await request(app.server)
      .post(`/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: user.id,
        gymId: gymResponse.body.gym.id,
        latitude: -6.256922,
        longitude: -36.52182,
      });

    const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24 + 2 * 1000 * 60 * 60;

    vi.advanceTimersByTime(ONE_DAY_IN_MS);

    const cookies = authResponse.get("Set-Cookie") ?? [];

    const refreshResponse = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    const refreshedToken = refreshResponse.body.token;

    await request(app.server)
      .post(`/check-ins`)
      .set("Authorization", `Bearer ${refreshedToken}`)
      .send({
        userId: user.id,
        gymId: gymResponse.body.gym.id,
        latitude: -6.256922,
        longitude: -36.52182,
      });

    const response = await request(app.server)
      .get(`/check-ins/history`)
      .set("Authorization", `Bearer ${refreshedToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gymResponse.body.gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gymResponse.body.gym.id,
        user_id: user.id,
      }),
    ]);
  });
});
