import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { loadScriptEnvironment, projectRoot } from "./lib/load-environment";
import { resolveScriptPath } from "./lib/resolve-script";

try {
  loadScriptEnvironment();
  const scriptPath = resolveScriptPath(
    process.env.SCRIPT_NAME,
    resolve(projectRoot, "scripts"),
  );
  // Avoid shell interpolation and use the same Node runtime on every platform.
  const child = spawn(
    process.execPath,
    ["--import", "tsx", scriptPath, ...process.argv.slice(2)],
    { cwd: projectRoot, env: process.env, stdio: "inherit" },
  );
  child.on("error", (error) => {
    console.error("Could not start script:", error.message);
    process.exitCode = 1;
  });
  child.on("exit", (code) => {
    process.exitCode = code ?? 1;
  });
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Could not run script.",
  );
  process.exitCode = 1;
}
