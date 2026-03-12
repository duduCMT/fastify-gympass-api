import { expect, describe, it } from "vitest";
import { compare } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories";
import { RegisterUseCase } from "./register.use-case";
import { UserAlreadyExistsError } from "./errors";

describe("Register Use Case", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Due 01",
      email: "johndue@example.com",
      password: "123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const password = "123456";

    const { user } = await registerUseCase.execute({
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
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "johndue@example.com";

    await registerUseCase.execute({
      name: "John Due 01",
      email,
      password: "123",
    });

    expect(() =>
      registerUseCase.execute({
        name: "John Due 02",
        email,
        password: "123",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
