/**
 * build-static.cjs
 *
 * Produces a clean Next.js static export (`out/`) suitable for Azure SWA:
 *   1. Copies `src/app/api/` to a temp location and deletes the original
 *      (API routes are incompatible with `output:'export'`; Azure Functions
 *      in the root `api/` folder handle them in production).
 *   2. Runs `next build` with STATIC_EXPORT=true.
 *   3. Always restores `src/app/api/` — whether the build succeeded or failed.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const nextApiDir = path.join(root, "src", "app", "api");
const tempApiDir = path.join(root, "_next_api_temp");

let backed = false;

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function backupAndRemove() {
  if (!fs.existsSync(nextApiDir)) return;
  if (fs.existsSync(tempApiDir)) fs.rmSync(tempApiDir, { recursive: true, force: true });
  copyDir(nextApiDir, tempApiDir);
  fs.rmSync(nextApiDir, { recursive: true, force: true });
  backed = true;
  console.log("  [build-static] Backed up + removed src/app/api/");
}

function restore() {
  if (backed && fs.existsSync(tempApiDir)) {
    if (!fs.existsSync(nextApiDir)) fs.mkdirSync(nextApiDir, { recursive: true });
    copyDir(tempApiDir, nextApiDir);
    fs.rmSync(tempApiDir, { recursive: true, force: true });
    console.log("  [build-static] Restored src/app/api/");
  }
}

process.on("exit", restore);
process.on("SIGINT", () => process.exit(1));
process.on("SIGTERM", () => process.exit(1));

console.log("\n[build-static] Starting static export build...\n");

// Clean the previous .next/export directory to avoid Windows EBUSY locks
const nextExportDir = path.join(root, ".next", "export");
if (fs.existsSync(nextExportDir)) {
  try {
    fs.rmSync(nextExportDir, { recursive: true, force: true });
    console.log("  [build-static] Cleaned .next/export/");
  } catch {
    console.warn("  [build-static] Could not clean .next/export/ — continuing anyway");
  }
}

backupAndRemove();

try {
  execSync("npx next build", {
    stdio: "inherit",
    cwd: root,
    env: { ...process.env, STATIC_EXPORT: "true" },
  });
  console.log("\n[build-static] Build succeeded. Output: out/\n");
} catch {
  console.error("\n[build-static] Build failed.\n");
  process.exit(1);
}
