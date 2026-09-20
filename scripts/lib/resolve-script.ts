import { existsSync } from "node:fs";
import { resolve } from "node:path";

export function resolveScriptPath(name: string | undefined, directory: string) {
  const scriptName = name?.trim().replace(/\.ts$/, "");
  if (!scriptName) {
    throw new Error(
      "Set SCRIPT_NAME to a TypeScript filename in scripts/, for example create-default-category.",
    );
  }
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(scriptName) || scriptName === "run") {
    throw new Error(
      "SCRIPT_NAME must name a file directly inside scripts/ (excluding run.ts).",
    );
  }

  const scriptPath = resolve(directory, `${scriptName}.ts`);
  if (!existsSync(scriptPath))
    throw new Error(`Script not found: ${scriptName}.ts`);
  return scriptPath;
}
