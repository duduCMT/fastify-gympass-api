import { expect, describe, it, beforeEach } from "vitest";
import { compare } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories";
import { UserAlreadyExistsError } from "../errors";
import { RegisterUseCase } from "./register.use-case";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Due 01",
      email: "johndue@example.com",
      password: "123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const password = "123456";

    const { user } = await sut.execute({
      name: "John Due",
      email: "johndue@example.com",
      password,
    });

    const isPasswordCorrectlysHashed = await compare(
      password,
      user.password_hash,
    );

    expect(isPasswordCorrectlysHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "johndue@example.com";

    await sut.execute({
      name: "John Due 01",
      email,
      password: "123",
    });

    await expect(() =>
      sut.execute({
        name: "John Due 02",
        email,
        password: "123",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
