import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories";
import { CheckInUseCase } from "./check-in.use-case";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { Gym } from "@/@types";
import { MaxDistanceError, MaxNumberOfCheckInsError } from "../errors";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;
let initialGym: Gym;

describe("Check-in Use Case", () => {
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

    sut = new CheckInUseCase(checkInsRepository, gymsRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: initialGym.id,
      userLatitude: -6.256922,
      userLongitude: -36.52182,
    });

    await expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

    const distantGym = await gymsRepository.create({
      title: "New Gym 02",
      description: null,
      latitude: -6.2609587,
      longitude: -36.5221023,
      phone: null,
    });

    await expect(() =>
      sut.execute({
        userId: "user-id",
        gymId: distantGym.id,
        userLatitude: -6.256922,
        userLongitude: -36.52182,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: initialGym.id,
      userLatitude: -6.256922,
      userLongitude: -36.52182,
    });
    await expect(() =>
      sut.execute({
        userId: "user-id",
        gymId: initialGym.id,
        userLatitude: -6.256922,
        userLongitude: -36.52182,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-id",
      gymId: initialGym.id,
      userLatitude: -6.256922,
      userLongitude: -36.52182,
    });

    vi.setSystemTime(new Date(2026, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: initialGym.id,
      userLatitude: -6.256922,
      userLongitude: -36.52182,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
