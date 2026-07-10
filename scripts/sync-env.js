const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, ".env.local");
const targets = [
  path.join(root, "apps", "reporting", ".env.local"),
  path.join(root, "apps", "resolution", ".env.local"),
  path.join(root, "apps", "analytics", ".env.local"),
];

if (!fs.existsSync(source)) {
  console.warn("sync-env: No root .env.local found — skipping.");
  process.exit(0);
}

const contents = fs.readFileSync(source, "utf8");

for (const target of targets) {
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) continue;
  fs.writeFileSync(target, contents);
  console.log(`sync-env: synced ${path.relative(root, target)}`);
}
