import { expect, describe, it, beforeEach } from "vitest";
import { compare, hash } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories";
import { AuthenticateUseCase } from "./authenticate.use-case";
import { InvalidCredentialsError } from "../errors";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
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
    await expect(() =>
      sut.execute({
        email: "johndue@example.com",
        password: "111",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
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
