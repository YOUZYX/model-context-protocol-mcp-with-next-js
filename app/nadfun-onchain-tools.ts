import { ethers } from "ethers";
import * as NadFunAbi from "../../../contract-abi";

// Monad Testnet contract addresses
export const CONTRACT_ADDRESSES = {
  CORE: "0x822EB1ADD41cf87C3F178100596cf24c9a6442f6",
  BONDING_CURVE_FACTORY: "0x60216FB3285595F4643f9f7cddAB842E799BD642",
  INTERNAL_UNISWAP_V2_ROUTER: "0x619d07287e87C9c643C60882cA80d23C8ed44652",
  INTERNAL_UNISWAP_V2_FACTORY: "0x13eD0D5e1567684D964469cCbA8A977CDA580827",
  WRAPPED_MON: "0x3bb9AFB94c82752E47706A10779EA525Cf95dc27",
};

// --- Bonding Curve Operations ---

// Buy tokens from bonding curve
export async function buyFromBondingCurve({
  privateKey,
  amountIn,
  token,
  to,
  providerUrl,
}: {
  privateKey?: string;
  amountIn: string; // in ETH
  token: string;
  to: string;
  providerUrl?: string;
}): Promise<{ txHash: string } | { error: string }> {
  // Use env var as default if not provided
  const pk = privateKey || process.env.WALLET_PRIVATE_KEY;
  const url = providerUrl || process.env.PROVIDER_URL || 'https://testnet-rpc.monad.xyz/';
  if (!pk) return { error: 'No private key provided (set WALLET_PRIVATE_KEY env var or pass as parameter)' };
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(pk, provider);
    const core = new ethers.Contract(CONTRACT_ADDRESSES.CORE, NadFunAbi.ICore, wallet);
    const amountInWei = ethers.parseEther(amountIn);
    const fee = amountInWei / BigInt(100); // 1% fee
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200);
    const tx = await core.buy(
      amountInWei,
      fee,
      token,
      to,
      deadline,
      { value: amountInWei + fee }
    );
    return { txHash: tx.hash };
  } catch (error: any) {
    return { error: error.message || String(error) };
  }
}

// Buy exact output amount from bonding curve
export async function exactOutBuyFromBondingCurve({
  privateKey,
  amountInMax,
  amountOut,
  token,
  to,
  providerUrl,
}: {
  privateKey?: string;
  amountInMax: string; // in ETH
  amountOut: string; // in tokens
  token: string;
  to: string;
  providerUrl?: string;
}): Promise<{ txHash: string } | { error: string }> {
  const pk = privateKey || process.env.WALLET_PRIVATE_KEY;
  const url = providerUrl || process.env.PROVIDER_URL || 'https://testnet-rpc.monad.xyz/';
  if (!pk) return { error: 'No private key provided (set WALLET_PRIVATE_KEY env var or pass as parameter)' };
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(pk, provider);
    const core = new ethers.Contract(CONTRACT_ADDRESSES.CORE, NadFunAbi.ICore, wallet);
    const amountInMaxWei = ethers.parseEther(amountInMax);
    const amountOutWei = ethers.parseEther(amountOut);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200);
    const tx = await core.exactOutBuy(
      amountInMaxWei,
      amountOutWei,
      token,
      to,
      deadline,
      { value: amountInMaxWei }
    );
    return { txHash: tx.hash };
  } catch (error: any) {
    return { error: error.message || String(error) };
  }
}

// Sell tokens to bonding curve
export async function sellToBondingCurve({
  privateKey,
  amountIn,
  token,
  to,
  providerUrl,
}: {
  privateKey?: string;
  amountIn: string; // in tokens
  token: string;
  to: string;
  providerUrl?: string;
}): Promise<{ txHash: string } | { error: string }> {
  const pk = privateKey || process.env.WALLET_PRIVATE_KEY;
  const url = providerUrl || process.env.PROVIDER_URL || 'https://testnet-rpc.monad.xyz/';
  if (!pk) return { error: 'No private key provided (set WALLET_PRIVATE_KEY env var or pass as parameter)' };
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(pk, provider);
    const core = new ethers.Contract(CONTRACT_ADDRESSES.CORE, NadFunAbi.ICore, wallet);
    const amountInWei = ethers.parseEther(amountIn);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200);
    const tx = await core.sell(
      amountInWei,
      token,
      to,
      deadline
    );
    return { txHash: tx.hash };
  } catch (error: any) {
    return { error: error.message || String(error) };
  }
}

// Sell exact output amount to bonding curve
export async function exactOutSellToBondingCurve({
  privateKey,
  amountInMax,
  amountOut,
  token,
  to,
  providerUrl,
}: {
  privateKey?: string;
  amountInMax: string; // in tokens
  amountOut: string; // in ETH
  token: string;
  to: string;
  providerUrl?: string;
}): Promise<{ txHash: string } | { error: string }> {
  const pk = privateKey || process.env.WALLET_PRIVATE_KEY;
  const url = providerUrl || process.env.PROVIDER_URL || 'https://testnet-rpc.monad.xyz/';
  if (!pk) return { error: 'No private key provided (set WALLET_PRIVATE_KEY env var or pass as parameter)' };
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(pk, provider);
    const core = new ethers.Contract(CONTRACT_ADDRESSES.CORE, NadFunAbi.ICore, wallet);
    const amountInMaxWei = ethers.parseEther(amountInMax);
    const amountOutWei = ethers.parseEther(amountOut);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200);
    const tx = await core.exactOutSell(
      amountInMaxWei,
      amountOutWei,
      token,
      to,
      deadline
    );
    return { txHash: tx.hash };
  } catch (error: any) {
    return { error: error.message || String(error) };
  }
}

// Create a new bonding curve
export async function createBondingCurve({
  privateKey,
  name,
  symbol,
  tokenUrl,
  providerUrl,
}: {
  privateKey?: string;
  name: string;
  symbol: string;
  tokenUrl: string;
  providerUrl?: string;
}): Promise<{ txHash: string } | { error: string }> {
  const pk = privateKey || process.env.WALLET_PRIVATE_KEY;
  const url = providerUrl || process.env.PROVIDER_URL || 'https://testnet-rpc.monad.xyz/';
  if (!pk) return { error: 'No private key provided (set WALLET_PRIVATE_KEY env var or pass as parameter)' };
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(pk, provider);
    const factory = new ethers.Contract(CONTRACT_ADDRESSES.BONDING_CURVE_FACTORY, NadFunAbi.IBondingCurveFactory, wallet);
    const tx = await factory.create(
      wallet.address,
      name,
      symbol,
      tokenUrl
    );
    return { txHash: tx.hash };
  } catch (error: any) {
    return { error: error.message || String(error) };
  }
}

// --- DEX Operations ---

// Buy tokens from DEX
export async function buyFromDex({
  privateKey,
  amountIn,
  minTokensOut,
  path,
  to,
  providerUrl,
  slippage = 0.5,
}: {
  privateKey?: string;
  amountIn: string; // in ETH
  minTokensOut: string; // in tokens
  path: string[]; // [WETH, token]
  to: string;
  providerUrl?: string;
  slippage?: number;
}): Promise<{ txHash: string } | { error: string }> {
  const pk = privateKey || process.env.WALLET_PRIVATE_KEY;
  const url = providerUrl || process.env.PROVIDER_URL || 'https://testnet-rpc.monad.xyz/';
  if (!pk) return { error: 'No private key provided (set WALLET_PRIVATE_KEY env var or pass as parameter)' };
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(pk, provider);
    const router = new ethers.Contract(CONTRACT_ADDRESSES.INTERNAL_UNISWAP_V2_ROUTER, NadFunAbi.IUniswapV2Router, wallet);
    const amountInWei = ethers.parseEther(amountIn);
    const minTokensOutWei = ethers.parseEther(minTokensOut);
    const deadline = Math.floor(Date.now() / 1000) + 1200;
    // Try swapExactNativeForTokens, fallback to swapExactETHForTokens
    let tx;
    if ((router.interface.fragments as any[]).some((f: any) => f.name === "swapExactNativeForTokens")) {
      tx = await router.swapExactNativeForTokens(
        minTokensOutWei,
        path,
        to,
        deadline,
        { value: amountInWei }
      );
    } else {
      tx = await router.swapExactETHForTokens(
        minTokensOutWei,
        path,
        to,
        deadline,
        { value: amountInWei }
      );
    }
    return { txHash: tx.hash };
  } catch (error: any) {
    return { error: error.message || String(error) };
  }
}

// Sell tokens to DEX
export async function sellToDex({
  privateKey,
  amountIn,
  minEthOut,
  path,
  to,
  providerUrl,
  slippage = 0.5,
}: {
  privateKey?: string;
  amountIn: string; // in tokens
  minEthOut: string; // in ETH
  path: string[]; // [token, WETH]
  to: string;
  providerUrl?: string;
  slippage?: number;
}): Promise<{ txHash: string } | { error: string }> {
  const pk = privateKey || process.env.WALLET_PRIVATE_KEY;
  const url = providerUrl || process.env.PROVIDER_URL || 'https://testnet-rpc.monad.xyz/';
  if (!pk) return { error: 'No private key provided (set WALLET_PRIVATE_KEY env var or pass as parameter)' };
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(pk, provider);
    const router = new ethers.Contract(CONTRACT_ADDRESSES.INTERNAL_UNISWAP_V2_ROUTER, NadFunAbi.IUniswapV2Router, wallet);
    const tokenContract = new ethers.Contract(path[0], NadFunAbi.IToken, wallet);
    const amountInWei = ethers.parseEther(amountIn);
    const minEthOutWei = ethers.parseEther(minEthOut);
    const deadline = Math.floor(Date.now() / 1000) + 1200;
    // Approve router to spend tokens
    const approveTx = await tokenContract.approve(CONTRACT_ADDRESSES.INTERNAL_UNISWAP_V2_ROUTER, amountInWei);
    await approveTx.wait();
    // Try swapExactTokensForNative, fallback to swapExactTokensForETH
    let tx;
    if ((router.interface.fragments as any[]).some((f: any) => f.name === "swapExactTokensForNative")) {
      tx = await router.swapExactTokensForNative(
        amountInWei,
        minEthOutWei,
        path,
        to,
        deadline
      );
    } else {
      tx = await router.swapExactTokensForETH(
        amountInWei,
        minEthOutWei,
        path,
        to,
        deadline
      );
    }
    return { txHash: tx.hash };
  } catch (error: any) {
    return { error: error.message || String(error) };
  }
}

// Add liquidity
export async function addLiquidity({
  privateKey,
  tokenA,
  tokenB,
  amountADesired,
  amountBDesired,
  amountAMin,
  amountBMin,
  to,
  providerUrl,
}: {
  privateKey?: string;
  tokenA: string;
  tokenB: string;
  amountADesired: string; // in tokens
  amountBDesired: string; // in tokens
  amountAMin: string; // in tokens
  amountBMin: string; // in tokens
  to: string;
  providerUrl?: string;
}): Promise<{ txHash: string } | { error: string }> {
  const pk = privateKey || process.env.WALLET_PRIVATE_KEY;
  const url = providerUrl || process.env.PROVIDER_URL || 'https://testnet-rpc.monad.xyz/';
  if (!pk) return { error: 'No private key provided (set WALLET_PRIVATE_KEY env var or pass as parameter)' };
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(pk, provider);
    const router = new ethers.Contract(CONTRACT_ADDRESSES.INTERNAL_UNISWAP_V2_ROUTER, NadFunAbi.IUniswapV2Router, wallet);
    const tokenAContract = new ethers.Contract(tokenA, NadFunAbi.IToken, wallet);
    const tokenBContract = new ethers.Contract(tokenB, NadFunAbi.IToken, wallet);
    const amountADesiredWei = ethers.parseEther(amountADesired);
    const amountBDesiredWei = ethers.parseEther(amountBDesired);
    const amountAMinWei = ethers.parseEther(amountAMin);
    const amountBMinWei = ethers.parseEther(amountBMin);
    const deadline = Math.floor(Date.now() / 1000) + 1200;
    // Approve router to spend both tokens
    const approveTxA = await tokenAContract.approve(CONTRACT_ADDRESSES.INTERNAL_UNISWAP_V2_ROUTER, amountADesiredWei);
    await approveTxA.wait();
    const approveTxB = await tokenBContract.approve(CONTRACT_ADDRESSES.INTERNAL_UNISWAP_V2_ROUTER, amountBDesiredWei);
    await approveTxB.wait();
    const tx = await router.addLiquidity(
      tokenA,
      tokenB,
      amountADesiredWei,
      amountBDesiredWei,
      amountAMinWei,
      amountBMinWei,
      to,
      deadline
    );
    return { txHash: tx.hash };
  } catch (error: any) {
    return { error: error.message || String(error) };
  }
}

// Remove liquidity
export async function removeLiquidity({
  privateKey,
  tokenA,
  tokenB,
  liquidity,
  amountAMin,
  amountBMin,
  to,
  providerUrl,
  lpTokenAddress,
}: {
  privateKey?: string;
  tokenA: string;
  tokenB: string;
  liquidity: string; // in LP tokens
  amountAMin: string; // in tokens
  amountBMin: string; // in tokens
  to: string;
  providerUrl?: string;
  lpTokenAddress: string;
}): Promise<{ txHash: string } | { error: string }> {
  const pk = privateKey || process.env.WALLET_PRIVATE_KEY;
  const url = providerUrl || process.env.PROVIDER_URL || 'https://testnet-rpc.monad.xyz/';
  if (!pk) return { error: 'No private key provided (set WALLET_PRIVATE_KEY env var or pass as parameter)' };
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(pk, provider);
    const router = new ethers.Contract(CONTRACT_ADDRESSES.INTERNAL_UNISWAP_V2_ROUTER, NadFunAbi.IUniswapV2Router, wallet);
    const lpTokenContract = new ethers.Contract(lpTokenAddress, NadFunAbi.IUniswapV2Pair, wallet);
    const liquidityWei = ethers.parseEther(liquidity);
    const amountAMinWei = ethers.parseEther(amountAMin);
    const amountBMinWei = ethers.parseEther(amountBMin);
    const deadline = Math.floor(Date.now() / 1000) + 1200;
    // Approve router to spend LP tokens
    const approveTx = await lpTokenContract.approve(CONTRACT_ADDRESSES.INTERNAL_UNISWAP_V2_ROUTER, liquidityWei);
    await approveTx.wait();
    const tx = await router.removeLiquidity(
      tokenA,
      tokenB,
      liquidityWei,
      amountAMinWei,
      amountBMinWei,
      to,
      deadline
    );
    return { txHash: tx.hash };
  } catch (error: any) {
    return { error: error.message || String(error) };
  }
}

// --- Utility/Helper Operations ---

// Approve tokens
export async function approveToken({
  privateKey,
  token,
  spender,
  amount,
  providerUrl,
}: {
  privateKey?: string;
  token: string;
  spender: string;
  amount: string; // in tokens
  providerUrl?: string;
}): Promise<{ txHash: string } | { error: string }> {
  const pk = privateKey || process.env.WALLET_PRIVATE_KEY;
  const url = providerUrl || process.env.PROVIDER_URL || 'https://testnet-rpc.monad.xyz/';
  if (!pk) return { error: 'No private key provided (set WALLET_PRIVATE_KEY env var or pass as parameter)' };
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(pk, provider);
    const tokenContract = new ethers.Contract(token, NadFunAbi.IToken, wallet);
    const amountWei = ethers.parseEther(amount);
    const tx = await tokenContract.approve(spender, amountWei);
    return { txHash: tx.hash };
  } catch (error: any) {
    return { error: error.message || String(error) };
  }
}

// Permit (EIP-2612)
export async function permitToken({
  privateKey,
  token,
  spender,
  value,
  deadline,
  v,
  r,
  s,
  providerUrl,
}: {
  privateKey?: string;
  token: string;
  spender: string;
  value: string; // in tokens
  deadline: number;
  v: number;
  r: string;
  s: string;
  providerUrl?: string;
}): Promise<{ txHash: string } | { error: string }> {
  const pk = privateKey || process.env.WALLET_PRIVATE_KEY;
  const url = providerUrl || process.env.PROVIDER_URL || 'https://testnet-rpc.monad.xyz/';
  if (!pk) return { error: 'No private key provided (set WALLET_PRIVATE_KEY env var or pass as parameter)' };
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const wallet = new ethers.Wallet(pk, provider);
    const tokenContract = new ethers.Contract(token, NadFunAbi.IToken, wallet);
    const valueWei = ethers.parseEther(value);
    const tx = await tokenContract.permit(
      wallet.address,
      spender,
      valueWei,
      deadline,
      v,
      r,
      s
    );
    return { txHash: tx.hash };
  } catch (error: any) {
    return { error: error.message || String(error) };
  }
}

// Get reserves, virtual reserves, k, fee config, etc.
export async function getBondingCurveInfo({
  providerUrl,
  curveAddress,
  tokenAddress,
}: {
  providerUrl?: string;
  curveAddress: string;
  tokenAddress: string;
}): Promise<any> {
  const url = providerUrl || process.env.PROVIDER_URL || 'https://testnet-rpc.monad.xyz/';
  try {
    const provider = new ethers.JsonRpcProvider(url);
    const curve = new ethers.Contract(curveAddress, NadFunAbi.IBondingCurve, provider);
    const core = new ethers.Contract(CONTRACT_ADDRESSES.CORE, NadFunAbi.ICore, provider);
    const [reserves, virtualReserves, k, feeConfig, isListing] = await Promise.all([
      curve.getReserves(),
      curve.getVirtualReserves(),
      curve.getK(),
      curve.getFeeConfig(),
      curve.getIsListing(),
    ]);
    const coreCurveData = await core.getCurveData(CONTRACT_ADDRESSES.BONDING_CURVE_FACTORY, tokenAddress);
    return {
      reserves,
      virtualReserves,
      k,
      feeConfig,
      isListing,
      coreCurveData,
    };
  } catch (error: any) {
    return { error: error.message || String(error) };
  }
} 