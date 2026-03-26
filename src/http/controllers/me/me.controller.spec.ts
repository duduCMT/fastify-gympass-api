import request from "supertest";
import { app } from "@/app";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Me Controller (Profile Controller)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get profile data", async () => {
    const user = {
      name: "John Due",
      email: "johndue@exemple.com",
      password: "123456",
    };

    await request(app.server).post("/users").send({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const authResponse = await request(app.server).post("/sessions").send({
      email: user.email,
      password: user.password,
    });

    const token = authResponse.body.token as string;

    const profileResponse = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: user.email,
      }),
    );
  });
});
