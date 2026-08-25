import type { NextConfig } from "next";
import nodePath from "node:path";

/**
 * Security headers for a gated IR site.
 *
 * X-Frame-Options is DENY everywhere except the stamped deck/HTML delivery
 * routes, which the document viewer iframes same-origin.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
];

const nextConfig: NextConfig = {
  // Chunk provenance requires webpack. --webpack is passed by the npm scripts;
  // this empty block silences Next 16's Turbopack-default warning if someone
  // runs `next dev` bare.
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer && config.optimization?.splitChunks) {
      // First-party client code is classified by provenance, not size
      // heuristics. Pre-auth shell modules stay in the normal chunk flow
      // (public). Everything else first-party is forced into `app-gated-*`;
      // src/data into `gated-data-*`. Middleware serves both only with a
      // session. scripts/check-public-chunks.ts fails the build if that
      // classification ever leaks a sample figure into a public chunk.
      const SHELL_PREFIXES = [
        "src/app/login",
        "src/app/pending-approval",
        "src/app/auth",
        "src/app/layout",
        "src/app/globals",
        "src/components/AnnouncementBanner",
        "src/components/ConditionalLayout",
        "src/components/ContentProtection",
        "src/components/Footer",
        "src/components/Header",
        "src/components/Providers",
        "src/config/site",
        "src/data/announcements",
        "src/lib/analytics/",
        "src/lib/cn",
        "src/lib/next-path",
        "src/utils/supabase/",
      ].map((p) => p.replace(/\//g, nodePath.sep));
      const sep = nodePath.sep;
      const srcSeg = `${sep}src${sep}`;
      const isFirstParty = (resource: string | undefined) =>
        !!resource && !resource.includes("node_modules") && resource.includes(srcSeg);
      const shellRelative = (resource: string) =>
        resource.slice(resource.lastIndexOf(srcSeg) + 1);

      config.plugins = config.plugins || [];
      config.plugins.push({
        apply(compiler: {
          hooks: {
            emit: { tap: (name: string, fn: (compilation: unknown) => void) => void };
          };
        }) {
          compiler.hooks.emit.tap("DataRoomChunkProvenance", (compilation) => {
            const c = compilation as {
              chunks: Iterable<{ files: Iterable<string> }>;
              chunkGraph: {
                getChunkModulesIterable: (chunk: unknown) => Iterable<{
                  resource?: string;
                  modules?: Iterable<{ resource?: string }>;
                }>;
              };
              assets: Record<string, unknown>;
            };
            const map: Record<string, string[]> = {};
            for (const chunk of c.chunks) {
              const mods = new Set<string>();
              const visit = (m: {
                resource?: string;
                modules?: Iterable<{ resource?: string }>;
              }) => {
                if (
                  m.resource &&
                  m.resource.includes(srcSeg) &&
                  !m.resource.includes("node_modules")
                ) {
                  mods.add("src/" + m.resource.split(srcSeg).pop()!.split(sep).join("/"));
                }
                if (m.modules) for (const inner of m.modules) visit(inner);
              };
              for (const m of c.chunkGraph.getChunkModulesIterable(chunk)) visit(m);
              for (const f of chunk.files) {
                if (f.endsWith(".js")) map["/_next/" + f.split("/").join("/")] = [...mods].sort();
              }
            }
            const json = JSON.stringify(map, null, 2);
            c.assets["chunk-provenance.json"] = {
              source: () => json,
              size: () => json.length,
            };
          });
        },
      });

      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        gatedData: {
          test: (m: { resource?: string }) =>
            isFirstParty(m.resource) &&
            m.resource!.includes(`${sep}data${sep}`) &&
            !m.resource!.includes("announcements"),
          name: "gated-data",
          chunks: "all",
          enforce: true,
          priority: 100,
        },
        appGated: {
          test: (m: { resource?: string }) =>
            isFirstParty(m.resource) &&
            !SHELL_PREFIXES.some((p) => shellRelative(m.resource!).startsWith(p)),
          name: "app-gated",
          chunks: "all",
          enforce: true,
          priority: 90,
        },
      };
    }
    return config;
  },
  async headers() {
    const headersWithoutFrameOpts = securityHeaders;
    return [
      {
        source: "/api/docs/:slug/deck",
        headers: [
          ...headersWithoutFrameOpts,
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/api/docs/:slug/html",
        headers: [
          ...headersWithoutFrameOpts,
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/:path((?!api/docs/[^/]+/(?:deck|html)).*)",
        headers: [
          ...securityHeaders,
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
