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
      "Returns the message you give it, starting with GMONAD",
      { message: z.string() },
      async ({ message }: { message: string }) => ({
        content: [{ type: "text", text: `Tool echo: ${message}` }],
      })
    );

    // 1. Get tokens created by an account
    server.tool(
      "get_created_tokens",
      "Get tokens created by a Nad.fun account",
      { account_address: z.string().describe("Nad.fun account address"), page: z.number().optional(), limit: z.number().optional() },
      async ({ account_address, page = 1, limit = 10 }: { account_address: string; page?: number; limit?: number }) => {
        const url = `https://testnet-bot-api-server.nad.fun/account/create_token/${account_address}?page=${page}&limit=${limit}`;
        const res = await fetch(url);
        const data = await res.json();
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    );

    // 2. Get account positions
    server.tool(
      "get_account_positions",
      "Get token positions for a Nad.fun account",
      { account_address: z.string().describe("Nad.fun account address"), position_type: z.enum(["all", "open", "close"]).optional(), page: z.number().optional(), limit: z.number().optional() },
      async ({ account_address, position_type = "open", page = 1, limit = 10 }: { account_address: string; position_type?: "all" | "open" | "close"; page?: number; limit?: number }) => {
        const url = `https://testnet-bot-api-server.nad.fun/account/position/${account_address}?position_type=${position_type}&page=${page}&limit=${limit}`;
        const res = await fetch(url);
        const data = await res.json();
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    );

    // 3. Get tokens ordered by creation time
    server.tool(
      "get_tokens_by_creation_time",
      "Get tokens ordered by creation time",
      { page: z.number().optional(), limit: z.number().optional() },
      async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
        const url = `https://testnet-bot-api-server.nad.fun/order/creation_time?page=${page}&limit=${limit}`;
        const res = await fetch(url);
        const data = await res.json();
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    );

    // 4. Get tokens ordered by latest trade
    server.tool(
      "get_tokens_by_latest_trade",
      "Get tokens ordered by latest trade",
      { page: z.number().optional(), limit: z.number().optional() },
      async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
        const url = `https://testnet-bot-api-server.nad.fun/order/latest_trade?page=${page}&limit=${limit}`;
        const res = await fetch(url);
        const data = await res.json();
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    );

    // 5. Get tokens ordered by market cap
    server.tool(
      "get_tokens_by_market_cap",
      "Get tokens ordered by market cap",
      { page: z.number().optional(), limit: z.number().optional() },
      async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
        const url = `https://testnet-bot-api-server.nad.fun/order/market_cap?page=${page}&limit=${limit}`;
        const res = await fetch(url);
        const data = await res.json();
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    );

    // 6. Get token chart data
    server.tool(
      "get_token_chart",
      "Get chart data for a token",
      { token: z.string().describe("Token contract address"), interval: z.string().optional() },
      async ({ token, interval = "1h" }: { token: string; interval?: string }) => {
        const baseTimestamp = Math.floor(Date.now() / 1000);
        const url = `https://testnet-bot-api-server.nad.fun/token/chart/${token}?interval=${interval}&base_timestamp=${baseTimestamp}`;
        const res = await fetch(url);
        const data = await res.json();
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    );

    // 7. Get token holders
    server.tool(
      "get_token_holders",
      "Get holders for a token",
      { token: z.string().describe("Token contract address"), page: z.number().optional(), limit: z.number().optional() },
      async ({ token, page = 1, limit = 10 }: { token: string; page?: number; limit?: number }) => {
        const url = `https://testnet-bot-api-server.nad.fun/token/holder/${token}?page=${page}&limit=${limit}`;
        const res = await fetch(url);
        const data = await res.json();
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    );

    // 8. Get token market info
    server.tool(
      "get_token_market",
      "Get market information for a token",
      { token: z.string().describe("Token contract address") },
      async ({ token }: { token: string }) => {
        const url = `https://testnet-bot-api-server.nad.fun/token/market/${token}`;
        const res = await fetch(url);
        const data = await res.json();
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    );

    // 9. Get token swap history
    server.tool(
      "get_token_swap_history",
      "Get swap history for a token",
      { token: z.string().describe("Token contract address"), page: z.number().optional(), limit: z.number().optional() },
      async ({ token, page = 1, limit = 10 }: { token: string; page?: number; limit?: number }) => {
        const url = `https://testnet-bot-api-server.nad.fun/token/swap/${token}?page=${page}&limit=${limit}`;
        const res = await fetch(url);
        const data = await res.json();
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    );

    // 10. Get token metadata
    server.tool(
      "get_token_metadata",
      "Get metadata for a token",
      { token: z.string().describe("Token contract address") },
      async ({ token }: { token: string }) => {
        const url = `https://testnet-bot-api-server.nad.fun/token/${token}`;
        const res = await fetch(url);
        const data = await res.json();
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      }
    );
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message for Nad's",
        },
        get_created_tokens: {
          description: "Get tokens created by a Nad.fun account",
        },
        get_account_positions: {
          description: "Get token positions for a Nad.fun account",
        },
        get_tokens_by_creation_time: {
          description: "Get tokens ordered by creation time",
        },
        get_tokens_by_latest_trade: {
          description: "Get tokens ordered by latest trade",
        },
        get_tokens_by_market_cap: {
          description: "Get tokens ordered by market cap",
        },
        get_token_chart: {
          description: "Get chart data for a token",
        },
        get_token_holders: {
          description: "Get holders for a token",
        },
        get_token_market: {
          description: "Get market information for a token",
        },
        get_token_swap_history: {
          description: "Get swap history for a token",
        },
        get_token_metadata: {
          description: "Get metadata for a token",
        },
      },
    },
  }
);
