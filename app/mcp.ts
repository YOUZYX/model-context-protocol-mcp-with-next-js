import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { ethers } from "ethers";

const NADFUN_PRIVATE_KEY = process.env.NADFUN_PRIVATE_KEY;

const createTokenSchema = z.object({
  name: z.string().describe("Token name"),
  symbol: z.string().describe("Token symbol"),
  description: z.string().describe("Token description"),
  image: z.string().optional().describe("Image URL (optional)"),
});

type CreateTokenParams = z.infer<typeof createTokenSchema>;

export const mcpHandler = initializeMcpApiHandler((server) => {
    // Add more tools, resources, and prompts here
    server.tool(
      "echo",
      "Returns the message you give it",
      { message: z.string() },
      async ({ message }: { message: string }) => ({
        content: [{ type: "text", text: `Tool echo: ${message}` }],
      })
    );

    server.tool(
      "create_meme_token",
      "Create a meme token on Nad.fun",
      createTokenSchema.shape,
      async ({ name, symbol, description, image }: CreateTokenParams) => {
        const NADFUN_PRIVATE_KEY = process.env.NADFUN_PRIVATE_KEY;
        if (!NADFUN_PRIVATE_KEY) {
          return {
            content: [{ type: "text", text: "NADFUN_PRIVATE_KEY is not set in environment variables." }],
          };
        }
        const wallet = new ethers.Wallet(NADFUN_PRIVATE_KEY);

        const res = await fetch(`https://testnet-bot-api-server.nad.fun/account/create_token/${wallet.address}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, symbol, description, image }),
          }
        );
        if (!res.ok) {
          return {
            content: [{ type: "text", text: `Nad.fun API error: ${res.statusText}` }],
          };
        }
        const data = await res.json();
        return {
          content: [
            {
              type: "text",
              text: `Token created! Tx Hash: ${data.tx_hash}\nToken Address: ${data.token_address}`,
            },
          ],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
        create_meme_token: {
          description: "Create a meme token on Nad.fun",
        },
      },
    },
  }
);
