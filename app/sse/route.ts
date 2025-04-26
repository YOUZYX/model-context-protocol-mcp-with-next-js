import { createServerResponseAdapter } from "@/lib/server-response-adapter";
import { mcpHandler } from "../mcp";

export const maxDuration = 60;

mcpHandler.tool('create_meme_token', async ({ account, name, symbol, description, image }) => {
  const res = await fetch(`https://testnet-bot-api-server.nad.fun/account/create_token/${account}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, symbol, description, image }),
  });
  if (!res.ok) {
    return { error: `Nad.fun API error: ${res.statusText}` };
  }
  const data = await res.json();
  return {
    txHash: data.tx_hash,
    tokenAddress: data.token_address,
    raw: data,
  };
});
