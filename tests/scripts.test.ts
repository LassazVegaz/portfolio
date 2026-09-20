import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { projectRoot } from "../scripts/lib/load-environment";
import { resolveScriptPath } from "../scripts/lib/resolve-script";

function withScriptProject(run: (directory: string) => void) {
  const directory = mkdtempSync(resolve(tmpdir(), "portfolio-scripts-"));
  try {
    mkdirSync(resolve(directory, "scripts"));
    cpSync(
      resolve(projectRoot, "scripts/run.ts"),
      resolve(directory, "scripts/run.ts"),
    );
    cpSync(
      resolve(projectRoot, "scripts/lib"),
      resolve(directory, "scripts/lib"),
      { recursive: true },
    );
    symlinkSync(
      resolve(projectRoot, "node_modules"),
      resolve(directory, "node_modules"),
      "junction",
    );
    writeFileSync(
      resolve(directory, "scripts/example.ts"),
      `
      console.log(JSON.stringify({ value: process.env.SCRIPT_TEST_VALUE, args: process.argv.slice(2) }));
      process.exitCode = Number(process.env.SCRIPT_TEST_EXIT || 0);
    `,
    );
    run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function execute(
  directory: string,
  environment: Record<string, string | undefined> = {},
) {
  return spawnSync(
    process.execPath,
    ["--import", "tsx", "scripts/run.ts", "hello world"],
    {
      cwd: directory,
      env: {
        ...process.env,
        NODE_ENV: "test",
        SCRIPT_NAME: undefined,
        SCRIPT_TEST_VALUE: undefined,
        SCRIPT_TEST_EXIT: undefined,
        ...environment,
      },
      encoding: "utf8",
    },
  );
}

test("runner loads the selected script and its environment from .env files", () => {
  withScriptProject((directory) => {
    writeFileSync(
      resolve(directory, ".env"),
      "SCRIPT_NAME=example\nSCRIPT_TEST_VALUE=base\n",
    );
    writeFileSync(resolve(directory, ".env.test"), "SCRIPT_TEST_VALUE=test\n");
    writeFileSync(
      resolve(directory, ".env.test.local"),
      "SCRIPT_TEST_VALUE=local-test\n",
    );
    const result = execute(directory);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), {
      value: "local-test",
      args: ["hello world"],
    });
  });
});

test("shell values override files, .ts suffix works, and child failure reaches the caller", () => {
  withScriptProject((directory) => {
    writeFileSync(
      resolve(directory, ".env"),
      "SCRIPT_NAME=missing\nSCRIPT_TEST_VALUE=file\n",
    );
    const result = execute(directory, {
      SCRIPT_NAME: "example.ts",
      SCRIPT_TEST_VALUE: "shell",
      SCRIPT_TEST_EXIT: "17",
    });
    assert.equal(result.status, 17, result.stderr);
    assert.equal(JSON.parse(result.stdout).value, "shell");
  });
});

test("test mode skips .env.local and does not load production configuration", () => {
  withScriptProject((directory) => {
    writeFileSync(
      resolve(directory, ".env"),
      "SCRIPT_NAME=example\nSCRIPT_TEST_VALUE=base\n",
    );
    writeFileSync(
      resolve(directory, ".env.local"),
      "SCRIPT_TEST_VALUE=local\n",
    );
    writeFileSync(
      resolve(directory, ".env.production.local"),
      "SCRIPT_TEST_VALUE=production\n",
    );
    const result = execute(directory);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).value, "base");
  });
});

test("development is the default mode, with .env.local taking priority over .env.development", () => {
  withScriptProject((directory) => {
    writeFileSync(resolve(directory, ".env"), "SCRIPT_NAME=example\n");
    writeFileSync(
      resolve(directory, ".env.development"),
      "SCRIPT_TEST_VALUE=development\n",
    );
    writeFileSync(
      resolve(directory, ".env.local"),
      "SCRIPT_TEST_VALUE=local\n",
    );
    const result = execute(directory, { NODE_ENV: undefined });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).value, "local");
  });
});

test("missing script configuration fails with actionable instructions", () => {
  withScriptProject((directory) => {
    const result = execute(directory);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Set SCRIPT_NAME/);
  });
});

test("script selection rejects traversal, commands, recursion and missing files", () => {
  withScriptProject((directory) => {
    const scripts = resolve(directory, "scripts");
    for (const name of [
      "../example",
      "run",
      "run.ts",
      "example; echo hello",
      "example.js",
      "missing",
      "",
    ]) {
      assert.throws(() => resolveScriptPath(name, scripts));
    }
    assert.equal(
      resolveScriptPath("example.ts", scripts),
      resolve(scripts, "example.ts"),
    );
  });
});
