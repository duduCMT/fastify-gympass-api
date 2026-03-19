import { expect, describe, it } from "vitest";
import { compare, hash } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories";
import { AuthenticateUseCase } from "./authenticate.use-case";
import { InvalidCredentialsError } from "../errors";

describe("Authenticate Use Case", () => {
  it("should be able to authenticate", async () => {
    const usersRepository = new InMemoryUsersRepository();

    await usersRepository.create({
      name: "John Due",
      email: "johndue@example.com",
      password_hash: await hash("123", 6),
    });

    const sut = new AuthenticateUseCase(usersRepository);

    const { user } = await sut.execute({
      email: "johndue@example.com",
      password: "123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(usersRepository);

    await expect(() =>
      sut.execute({
        email: "johndue@example.com",
        password: "111",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    const usersRepository = new InMemoryUsersRepository();

    await usersRepository.create({
      name: "John Due",
      email: "johndue@example.com",
      password_hash: await hash("123", 6),
    });

    const sut = new AuthenticateUseCase(usersRepository);

    await expect(() =>
      sut.execute({
        email: "johndue@example.com",
        password: "111",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
