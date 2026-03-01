import type { NextConfig } from "next";

const repoName = "goat-network-dash";
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const isStaticExport = process.env.NEXT_STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport
    ? {
        output: "export" as const,
        images: {
          unoptimized: true,
        },
        ...(isGitHubActions
          ? {
              basePath: `/${repoName}`,
              assetPrefix: `/${repoName}/`,
            }
          : {}),
      }
    : {}),
};

export default nextConfig;
