import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories";
import { GetUserProfileUseCase } from "./get-user-profile.use-case";
import { ResourceNotFoundError } from "../errors";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able to get user profile by id", async () => {
    const createdUser = await usersRepository.create({
      name: "John Due",
      email: "johndue@example.com",
      password_hash: await hash("123", 6),
    });

    const sut = new GetUserProfileUseCase(usersRepository);

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.id).toEqual(createdUser.id);
    expect(user.name).toEqual(createdUser.name);
  });

  it("should not be able to get user profile with wrong id", async () => {
    await expect(() =>
      sut.execute({
        userId: "non-existing-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
