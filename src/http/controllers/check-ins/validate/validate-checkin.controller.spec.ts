import request from "supertest";
import { app } from "@/app";

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test";
import { prisma } from "@/lib/prisma";

describe("Check-In Validate Controller", () => {
  beforeAll(async () => {
    await app.ready();
    vi.useFakeTimers();
  });

  afterAll(async () => {
    await app.close();
    vi.useRealTimers();
  });

  it("should be able to validate check-ins", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

    const { token, user } = await createAndAuthenticateUser(app, "ADMIN");

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

    const checkInResponse = await request(app.server)
      .post(`/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: user.id,
        gymId: gymResponse.body.gym.id,
        latitude: -6.256922,
        longitude: -36.52182,
      });

    const response = await request(app.server)
      .patch(`/check-ins/${checkInResponse.body.checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkIn).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );

    const updatedCheckIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkInResponse.body.checkIn.id,
      },
    });

    expect(updatedCheckIn.validated_at).toEqual(expect.any(Date));
  });
});
