import { cp } from "node:fs/promises";
import { join } from "node:path";

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
