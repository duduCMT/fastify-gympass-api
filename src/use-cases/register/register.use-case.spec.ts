import { expect, describe, it } from "vitest";
import { compare } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories";
import { UserAlreadyExistsError } from "../errors";
import { RegisterUseCase } from "./register.use-case";

describe("Register Use Case", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(usersRepository);

    const { user } = await sut.execute({
      name: "John Due 01",
      email: "johndue@example.com",
      password: "123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(usersRepository);

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
