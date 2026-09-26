import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

export const projectRoot = resolve(__dirname, "../..");

/** Existing shell variables win; earlier files take precedence over later ones. */
export function loadScriptEnvironment(directory = projectRoot) {
  const environment = process.env.NODE_ENV || "development";
  const files = [
    `.env.${environment}.local`,
    ...(environment === "test" ? [] : [".env.local"]),
    `.env.${environment}`,
    ".env",
  ];

  config({
    path: files
      .map((file) => resolve(directory, file))
      .filter((file) => existsSync(file)),
    override: false,
    quiet: true,
  });
}
