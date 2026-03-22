import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { Gym } from "@/@types";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history.use-case";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: FetchUserCheckInsHistoryUseCase;
let initialGym: Gym;

describe("Fetch User Check-in History Use Case", () => {
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

    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to fetch check-in history", async () => {
    await checkInsRepository.create({
      gym_id: initialGym.id,
      user_id: "user-id",
    });

    await checkInsRepository.create({
      gym_id: "gym-id-02",
      user_id: "user-id",
    });

    const { checkIns } = await sut.execute({
      userId: "user-id",
      page: 1,
    });

    await expect(checkIns.length).toEqual(2);
    await expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: initialGym.id }),
      expect.objectContaining({ gym_id: "gym-id-02" }),
    ]);
  });

  it("should be able to fetch paginated check-in history", async () => {
    for (let index = 1; index <= 22; index++) {
      await checkInsRepository.create({
        gym_id: `gym-id-${index}`,
        user_id: "user-id",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-id",
      page: 2,
    });

    await expect(checkIns.length).toEqual(2);
    await expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: `gym-id-21` }),
      expect.objectContaining({ gym_id: `gym-id-22` }),
    ]);
  });
});
