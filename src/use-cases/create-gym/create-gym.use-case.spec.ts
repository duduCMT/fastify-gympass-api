import { expect, describe, it, beforeEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { CreateGymUseCase } from "./create-gym.use-case";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to create a new gym", async () => {
    const { gym } = await sut.execute({
      title: "New Gym",
      description: null,
      latitude: -6.2609587,
      longitude: -36.5221023,
      phone: null,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
