import { defineConfig } from "prisma/config";
import { loadDatabaseEnvironment } from "./prisma/load-environment";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: loadDatabaseEnvironment(),
  },
});
