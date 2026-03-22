import { expect, describe, it, beforeEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { SearchGymUseCase } from "./search-gyms.use-case";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Search Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: `Typescript Gym`,
      description: null,
      latitude: -6.2609587,
      longitude: -36.5221023,
      phone: null,
    });

    const gymToSearch = await gymsRepository.create({
      title: `Javascript Gym`,
      description: null,
      latitude: -6.2609587,
      longitude: -36.5221023,
      phone: null,
    });

    const { gyms } = await sut.execute({
      page: 1,
      query: "Javascript",
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ id: gymToSearch.id })]);
  });

  it("should be able to search paginated gyms", async () => {
    for (let index = 1; index <= 22; index++) {
      await gymsRepository.create({
        title: `Typescript Gym ${index}`,
        description: null,
        latitude: -6.2609587,
        longitude: -36.5221023,
        phone: null,
      });
    }

    const { gyms } = await sut.execute({
      page: 2,
      query: "Typescript",
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: `Typescript Gym 21` }),
      expect.objectContaining({ title: `Typescript Gym 22` }),
    ]);
  });
});
