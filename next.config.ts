import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import { withEve } from "eve/next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Media uploaded via the Vercel Blob storage adapter (see payload.config.ts).
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default withEve(withPayload(nextConfig), {
  agents: {
    "social-media": "./agents/social-media",
  },
});
