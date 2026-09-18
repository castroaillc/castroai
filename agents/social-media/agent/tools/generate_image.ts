import { generateImage } from "ai";
import { put } from "@vercel/blob";
import { defineTool } from "eve/tools";
import { z } from "zod";

const EXTENSION_BY_MEDIA_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export default defineTool({
  description:
    "Generate an on-brand image from a text prompt and host it at a public URL. Use this to produce the image an Instagram post requires (Instagram has no text-only post type).",
  inputSchema: z.object({
    prompt: z.string().min(1).describe("A detailed description of the image to generate."),
  }),
  label: {
    start: ({ prompt }) => `Generate image: ${prompt}`,
  },
  async execute({ prompt }) {
    const result = await generateImage({
      model: "openai/gpt-image-1",
      prompt,
    });

    const extension = EXTENSION_BY_MEDIA_TYPE[result.image.mediaType] ?? "png";
    const blob = await put(
      `social-media/${Date.now()}.${extension}`,
      Buffer.from(result.image.uint8Array),
      { access: "public", contentType: result.image.mediaType }
    );

    return { imageUrl: blob.url };
  },
});
