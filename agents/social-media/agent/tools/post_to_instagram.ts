import { connect } from "@vercel/connect/eve";
import { defineTool } from "eve/tools";
import { always } from "eve/tools/approval";
import { z } from "zod";

const instagramAuth = connect("instagram/social-media");

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

export default defineTool({
  description:
    "Publish an image post to the castroai Instagram account. Instagram has no text-only post type, so pass a publicly hosted image URL (e.g. from generate_image). This is a real, public, irreversible action — only call it once the user has confirmed they want this exact image and caption published.",
  inputSchema: z.object({
    caption: z.string().max(2200).describe("The Instagram caption."),
    imageUrl: z.string().url().describe("A publicly reachable image URL, e.g. from generate_image."),
  }),
  approval: always(),
  label: {
    start: () => "Post to Instagram",
  },
  async execute({ caption, imageUrl }, ctx) {
    const igUserId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    if (!igUserId) {
      throw new Error(
        "INSTAGRAM_BUSINESS_ACCOUNT_ID is not configured. Set it to castroai's Instagram Business Account id."
      );
    }

    const { token } = await ctx.getToken(instagramAuth);

    const containerResponse = await fetch(`${GRAPH_API_BASE}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl, caption, access_token: token }),
    });

    if (containerResponse.status === 401) ctx.requireAuth(instagramAuth);
    if (!containerResponse.ok) {
      throw new Error(
        `Instagram media container failed (${containerResponse.status}): ${await containerResponse.text()}`
      );
    }

    const { id: creationId } = (await containerResponse.json()) as { id: string };

    const publishResponse = await fetch(`${GRAPH_API_BASE}/${igUserId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: creationId, access_token: token }),
    });

    if (!publishResponse.ok) {
      throw new Error(
        `Instagram publish failed (${publishResponse.status}): ${await publishResponse.text()}`
      );
    }

    const { id: mediaId } = (await publishResponse.json()) as { id: string };
    return { mediaId };
  },
});
