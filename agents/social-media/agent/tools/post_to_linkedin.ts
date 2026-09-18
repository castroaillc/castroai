import { connect } from "@vercel/connect/eve";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

const linkedinAuth = connect("linkedin/social-media");

// LinkedIn requires this header on every Posts API call, pinned to a
// specific month. Bump periodically per https://learn.microsoft.com/linkedin/marketing/versioning
const LINKEDIN_API_VERSION = "202601";

export default defineTool({
  description:
    "Publish a text post to LinkedIn as the person who connected their LinkedIn account. This is a real, public, irreversible action — only call it once the user has confirmed they want this exact text published.",
  inputSchema: z.object({
    text: z.string().min(1).max(3000).describe("The exact post copy (LinkedIn 'commentary')."),
  }),
  approval: always(),
  label: {
    start: () => "Post to LinkedIn",
  },
  async execute({ text }, ctx) {
    const { token } = await ctx.getToken(linkedinAuth);

    // Posts author as the connected member, so resolve their LinkedIn member
    // id first (requires the "openid" scope from Sign In with LinkedIn).
    const userinfoResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (userinfoResponse.status === 401) ctx.requireAuth(linkedinAuth);
    if (!userinfoResponse.ok) {
      throw new Error(
        `Could not look up the connected LinkedIn member (${userinfoResponse.status}): ${await userinfoResponse.text()}`
      );
    }
    const { sub: memberId } = (await userinfoResponse.json()) as { sub: string };

    const response = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "Linkedin-Version": LINKEDIN_API_VERSION,
      },
      body: JSON.stringify({
        author: `urn:li:person:${memberId}`,
        commentary: text,
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      }),
    });

    if (response.status === 401) ctx.requireAuth(linkedinAuth);
    if (!response.ok) {
      throw new Error(`LinkedIn post failed (${response.status}): ${await response.text()}`);
    }

    return { postUrn: response.headers.get("x-restli-id") };
  },
});
