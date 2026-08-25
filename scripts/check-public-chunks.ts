/**
 * Post-build leak guard.
 *
 * Fails the build if a JS chunk that middleware treats as public contains a
 * sentinel from the gated data layer. The sentinels here are the sample
 * figures that live only in src/lib/dataroom-variants.ts and must never
 * appear in the login bundle.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { isPublicChunk } from "../src/lib/chunk-gate";

const SENTINELS = [
  "500000000",
  "1000000000",
  "builtin-full",
  "Working-capital buffer",
];

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith(".js")) files.push(full);
  }
  return files;
}

async function main() {
  const chunksDir = path.join(process.cwd(), ".next", "static", "chunks");
  try {
    await stat(chunksDir);
  } catch {
    console.log("check-public-chunks: no .next/static/chunks yet, skipping.");
    return;
  }

  const files = await walk(chunksDir);
  const leaks: string[] = [];
  for (const file of files) {
    const urlPath = "/_next/static/chunks/" + path.relative(chunksDir, file).split(path.sep).join("/");
    if (!isPublicChunk(urlPath)) continue;
    const source = await readFile(file, "utf8");
    for (const sentinel of SENTINELS) {
      if (source.includes(sentinel)) {
        leaks.push(`${urlPath} contains ${sentinel}`);
      }
    }
  }

  if (leaks.length > 0) {
    console.error("Public chunks leaked gated sentinels:\n" + leaks.join("\n"));
    process.exit(1);
  }
  console.log(`check-public-chunks: ${files.length} chunks scanned, no leaks.`);
}

void main();
