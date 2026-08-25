import { cp } from "node:fs/promises";
import { join } from "node:path";

// Vercel packages the Next.js runtime through its own build adapter.
if (process.env.VERCEL) process.exit(0);

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

await cp(join(root, "public"), join(standalone, "public"), {
  recursive: true,
  force: true,
});
await cp(join(root, ".next", "static"), join(standalone, ".next", "static"), {
  recursive: true,
  force: true,
});
