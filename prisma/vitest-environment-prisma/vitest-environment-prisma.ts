import { prisma } from "@/lib/prisma";
import "dotenv/config";
import { execSync } from "node:child_process";

import { randomUUID } from "node:crypto";

import type { Environment } from "vitest/environments";

function generateDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provida a DATABASE_URL env variable");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schemaId);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    const schemaId = randomUUID();
    const databaseUrl = generateDatabaseUrl(schemaId);

    process.env.DATABASE_URL = databaseUrl;

    console.log(process.env.DATABASE_URL);

    execSync("npx prisma migrate deploy");

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`,
        );

        await prisma.$disconnect();
      },
    };
  },
};
