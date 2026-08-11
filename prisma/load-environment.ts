import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";

export const loadDatabaseEnvironment = () => {
  const envFiles = [".env.production.local", ".env.development.local"];
  if (process.env.NODE_ENV === "development") envFiles.reverse();

  config({
    path: envFiles
      .map((file) => path.resolve(process.cwd(), file))
      .filter((file) => fs.existsSync(file)),
  });

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
  }

  return process.env.DATABASE_URL;
};
