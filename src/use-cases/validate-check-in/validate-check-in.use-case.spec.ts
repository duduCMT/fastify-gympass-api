import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories";
import { ValidateCheckInUseCase } from "./validate-check-in.use-case";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { Gym } from "@/@types";
import { LateCheckInValidationError, ResourceNotFoundError } from "../errors";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: ValidateCheckInUseCase;
let initialGym: Gym;

describe("Validate Check-in Use Case", () => {
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

    sut = new ValidateCheckInUseCase(checkInsRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate the check-in", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

    const createdInCheckIn = await checkInsRepository.create({
      user_id: "user-id",
      gym_id: initialGym.id,
    });

    const { checkIn } = await sut.execute({
      checkInId: createdInCheckIn.id,
    });

    await expect(checkIn.validated_at).toEqual(expect.any(Date));
    await expect(checkInsRepository.items[0].validated_at).toEqual(
      expect.any(Date),
    );
  });

  it("should be not able to validate an inexistent check-in", async () => {
    await expect(
      sut.execute({
        checkInId: "inexistent-check-in-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2026, 0, 1, 13, 40));

    const createdInCheckIn = await checkInsRepository.create({
      user_id: "user-id",
      gym_id: initialGym.id,
    });

    const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21;

    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS);

    await expect(
      sut.execute({
        checkInId: createdInCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
