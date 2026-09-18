import { defineAgent } from "eve";
import { ollama } from "ollama-ai-provider-v2";

// Set OLLAMA_MODEL locally (e.g. in .env.local) to test for free against a
// model running in Ollama instead of the Vercel AI Gateway. Leave it unset
// (as in production) to use the Gateway model below.
//
// Ollama isn't in the AI Gateway's model catalog, so eve can't look up its
// context window automatically — it must be given explicitly, and it must
// not exceed whatever `num_ctx` Ollama is actually running the model with
// (Ollama's own default is much smaller than most models' architectural
// max). Override with OLLAMA_CONTEXT_WINDOW_TOKENS if you've configured a
// larger num_ctx.
export default defineAgent(
  process.env.OLLAMA_MODEL
    ? {
        model: ollama(process.env.OLLAMA_MODEL),
        modelContextWindowTokens: Number(process.env.OLLAMA_CONTEXT_WINDOW_TOKENS ?? 8192),
      }
    : { model: "anthropic/claude-sonnet-5" }
);
