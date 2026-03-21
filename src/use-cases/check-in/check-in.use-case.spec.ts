import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories";
import { CheckInUseCase } from "./check-in.use-case";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { Decimal } from "@prisma/client/runtime";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    gymsRepository.items.push({
      id: "gym-id",
      title: "Gym",
      created_at: new Date(),
      description: "",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: "",
      updated_at: new Date(),
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
      gymId: "gym-id",
      userLatitude: -6.256922,
      userLongitude: -36.52182,
    });

    await expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -6.256922,
      userLongitude: -36.52182,
    });
    await expect(() =>
      sut.execute({
        userId: "user-id",
        gymId: "gym-id",
        userLatitude: -6.256922,
        userLongitude: -36.52182,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -6.256922,
      userLongitude: -36.52182,
    });

    vi.setSystemTime(new Date(2026, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-id",
      gymId: "gym-id",
      userLatitude: -6.256922,
      userLongitude: -36.52182,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
