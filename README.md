# Example MCP Server built on Next.js

This project is an example implementation of a Model Context Protocol (MCP) server using Next.js. It provides a set of on-chain and off-chain tools for interacting with the Nad.fun protocol on Monad Testnet, and can be easily extended with your own tools and prompts.

## Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- Redis instance (for production/Vercel deployment)

## Installation

Clone the repository and install dependencies:

```sh
pnpm install
# or
npm install
```

## Running Locally

Start the development server:

```sh
pnpm dev
# or
npm run dev
```

The server will be available at `http://localhost:3000` by default.

## Usage

You can interact with the MCP server using the provided sample client script:

```sh
node scripts/test-client.mjs https://funmcp.vercel.app
```

Or, for the streamable HTTP client:

```sh
node scripts/test-streamable-http-client.mjs https://funmcp.vercel.app
```

**Note:** The MCP server exposes an `/sse` endpoint for Server-Sent Events (SSE) streaming. You can use `https://funmcp.vercel.app/sse` as the endpoint for compatible clients and IDE integrations.

## Configuration

- Update `app/mcp.ts` to add or modify tools, prompts, and resources.
- For on-chain operations, set the following environment variables (or provide them as parameters):
  - `PROVIDER_URL` (default: `https://testnet-rpc.monad.xyz/`)
  - `WALLET_PRIVATE_KEY` (for signing transactions)
- For Vercel deployment, ensure you have a Redis instance and [Fluid compute](https://vercel.com/docs/functions/fluid-compute) enabled.

## Available Tools

### Off-chain Nad.fun Tools

- **echo**
  - *Description*: Returns the message you give it.
  - *Parameters*: `{ message: string }`

- **get_created_tokens**
  - *Description*: Get tokens created by a Nad.fun account.
  - *Parameters*: `{ account_address: string, page?: number, limit?: number }`

- **get_account_positions**
  - *Description*: Get token positions for a Nad.fun account.
  - *Parameters*: `{ account_address: string, position_type?: "all" | "open" | "close", page?: number, limit?: number }`

- **get_tokens_by_creation_time**
  - *Description*: Get tokens ordered by creation time.
  - *Parameters*: `{ page?: number, limit?: number }`

- **get_tokens_by_latest_trade**
  - *Description*: Get tokens ordered by latest trade.
  - *Parameters*: `{ page?: number, limit?: number }`

- **get_tokens_by_market_cap**
  - *Description*: Get tokens ordered by market cap.
  - *Parameters*: `{ page?: number, limit?: number }`

- **get_token_chart**
  - *Description*: Get chart data for a token.
  - *Parameters*: `{ token: string, interval?: string }`

- **get_token_holders**
  - *Description*: Get holders for a token.
  - *Parameters*: `{ token: string, page?: number, limit?: number }`

- **get_token_market**
  - *Description*: Get market information for a token.
  - *Parameters*: `{ token: string }`

- **get_token_swap_history**
  - *Description*: Get swap history for a token.
  - *Parameters*: `{ token: string, page?: number, limit?: number }`

- **get_token_metadata**
  - *Description*: Get metadata for a token.
  - *Parameters*: `{ token: string }`

### On-chain Nad.fun Tools

- **buy_from_bonding_curve**
  - *Description*: Buy tokens from Nad.fun bonding curve.
  - *Parameters*: `{ privateKey: string, amountIn: string, token: string, to: string, providerUrl: string }`

- **exact_out_buy_from_bonding_curve**
  - *Description*: Buy exact output amount from Nad.fun bonding curve.
  - *Parameters*: `{ privateKey: string, amountInMax: string, amountOut: string, token: string, to: string, providerUrl: string }`

- **sell_to_bonding_curve**
  - *Description*: Sell tokens to Nad.fun bonding curve.
  - *Parameters*: `{ privateKey: string, amountIn: string, token: string, to: string, providerUrl: string }`

- **exact_out_sell_to_bonding_curve**
  - *Description*: Sell exact output amount to Nad.fun bonding curve.
  - *Parameters*: `{ privateKey: string, amountInMax: string, amountOut: string, token: string, to: string, providerUrl: string }`

- **create_bonding_curve**
  - *Description*: Create a new Nad.fun bonding curve.
  - *Parameters*: `{ privateKey: string, name: string, symbol: string, tokenUrl: string, providerUrl: string }`

- **buy_from_dex**
  - *Description*: Buy tokens from Nad.fun DEX.
  - *Parameters*: `{ privateKey: string, amountIn: string, minTokensOut: string, path: string[], to: string, providerUrl: string, slippage?: number }`

- **sell_to_dex**
  - *Description*: Sell tokens to Nad.fun DEX.
  - *Parameters*: `{ privateKey: string, amountIn: string, minEthOut: string, path: string[], to: string, providerUrl: string, slippage?: number }`

- **add_liquidity**
  - *Description*: Add liquidity to Nad.fun DEX.
  - *Parameters*: `{ privateKey: string, tokenA: string, tokenB: string, amountADesired: string, amountBDesired: string, amountAMin: string, amountBMin: string, to: string, providerUrl: string }`

- **remove_liquidity**
  - *Description*: Remove liquidity from Nad.fun DEX.
  - *Parameters*: `{ privateKey: string, tokenA: string, tokenB: string, liquidity: string, amountAMin: string, amountBMin: string, to: string, providerUrl: string, lpTokenAddress: string }`

- **approve_token**
  - *Description*: Approve a token for Nad.fun DEX or bonding curve.
  - *Parameters*: `{ privateKey: string, token: string, spender: string, amount: string, providerUrl: string }`

- **permit_token**
  - *Description*: Permit (EIP-2612) a token for Nad.fun DEX or bonding curve.
  - *Parameters*: `{ privateKey: string, token: string, spender: string, value: string, deadline: number, v: number, r: string, s: string, providerUrl: string }`

- **get_bonding_curve_info**
  - *Description*: Get info about a Nad.fun bonding curve.
  - *Parameters*: `{ providerUrl: string, curveAddress: string, tokenAddress: string }`

## Notes for running on Vercel

- Requires a Redis attached to the project under `process.env.REDIS_URL`
- Make sure you have [Fluid compute](https://vercel.com/docs/functions/fluid-compute) enabled for efficient execution
- After enabling Fluid compute, open `app/sse/route.ts` and adjust max duration to 800 if you are using a Vercel Pro or Enterprise account
- [Deploy the Next.js MCP template](https://vercel.com/templates/next.js/model-context-protocol-mcp-with-next-js)

## IDE Integration (Cursor & VSCode)

You can use this MCP server directly from IDEs like Cursor and VSCode by configuring the endpoint and authentication in their respective JSON config files.

### Example: `.cursor/mcp.json`

```json
{
  "mcpServers": {
    "funmcp": {
      "url": "https://funmcp.vercel.app/sse",
      "env": {
        "PROVIDER_URL": "https://testnet-rpc.monad.xyz/",
        "WALLET_PRIVATE_KEY": "<your-private-key>"
      }
    }
  }
}
```

### Example: `.vscode/mcp.json`

```json
{
  "servers": {
    "funonchain": {
      "type": "sse",
      "url": "https://funmcp.vercel.app/sse",
      "env": {
        "PROVIDER_URL": "https://testnet-rpc.monad.xyz/", 
        "WALLET_PRIVATE_KEY": "<your-private-key>"
      }
    }
  }
}
```

Replace `<your-private-key>` with your actual private key for on-chain operations.

## References

- [Model Context Protocol TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Nad.fun](https://nad.fun/)
