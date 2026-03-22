import { expect, describe, it, beforeEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms.use-case";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to get nearby gyms", async () => {
    const nearbyGym = await gymsRepository.create({
      title: `Nearby Gym`,
      description: null,
      latitude: -6.256922,
      longitude: -36.52182,
      phone: null,
    });

    await gymsRepository.create({
      title: `Distant Gym`,
      description: null,
      latitude: 0,
      longitude: 0,
      phone: null,
    });

    const { gyms } = await sut.execute({
      userLatitude: -6.256922,
      userLongitude: -36.52182,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ id: nearbyGym.id })]);
  });
});
