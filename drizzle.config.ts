import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/auth-schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Scope drizzle-kit to the better-auth schema only, so it never sees
  // (or tries to diff against) Payload's tables in the "payload" schema.
  schemaFilter: ["better-auth"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
