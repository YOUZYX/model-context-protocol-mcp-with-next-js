import { createServerResponseAdapter } from "@/lib/server-response-adapter";
import { mcpHandler } from "../mcp";

export const maxDuration = 60;

export async function GET(req: Request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    // Near the end of 60 seconds, call yourself
    fetch(req.url, { signal: controller.signal }).catch((err) => {
      console.error("Re-invocation failed:", err);
    });
  }, 59000); // 59 seconds

  try {
    return await createServerResponseAdapter(req.signal, (res) => {
      mcpHandler(req, res);
    });
  } finally {
    clearTimeout(timeout);
  }
}
