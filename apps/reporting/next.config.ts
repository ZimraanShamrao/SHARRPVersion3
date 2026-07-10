import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";

const monorepoRoot = path.resolve(__dirname, "../..");
const appDir = __dirname;

// Load env from monorepo root (shared) and app directory (Next.js default)
loadEnvConfig(monorepoRoot);
loadEnvConfig(appDir);

const nextConfig: NextConfig = {};

export default nextConfig;
