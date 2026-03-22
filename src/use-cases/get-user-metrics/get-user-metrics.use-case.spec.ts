import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { Gym } from "@/@types";
import { GetUserMetricsUseCase } from "./get-user-metrics.use-case";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: GetUserMetricsUseCase;
let initialGym: Gym;

describe("Get User Metrics Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();

    initialGym = await gymsRepository.create({
      title: "New Gym",
      description: null,
      latitude: -6.256922,
      longitude: -36.52182,
      phone: null,
    });

    sut = new GetUserMetricsUseCase(checkInsRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shold be able to get check-ins count from metrics", async () => {
    for (let index = 1; index <= 22; index++) {
      await checkInsRepository.create({
        gym_id: `gym-id-${index}`,
        user_id: "user-id",
      });
    }

    const { checkInsCount } = await sut.execute({
      userId: "user-id",
    });

    await expect(checkInsCount).toEqual(22);
  });
});
