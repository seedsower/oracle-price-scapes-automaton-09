import { supabase } from "@/integrations/supabase/client";

export interface DEXQuote {
  inputAmount: string;
  outputAmount: string;
  priceImpact: number;
  fees: string;
  route: string[];
  estimatedGas?: string;
}

export interface DEXTradingPair {
  baseTokenId: string;
  baseSymbol: string;
  baseName: string;
  ticker: string;
  blockchain: string;
  contractAddress: string;
  aerodromePoolAddress?: string;
  jupiterMintAddress?: string;
  liquidityUsd: number;
  dailyVolumeUsd: number;
  isActive: boolean;
  pairTokenId?: string;
  pairSymbol?: string;
  pairBlockchain?: string;
  pairContractAddress?: string;
}

export class DEXService {
  // Aerodrome Base DEX Integration
  async getAerodromeQuote(
    tokenIn: string,
    tokenOut: string,
    amountIn: string
  ): Promise<DEXQuote | null> {
    try {
      // Aerodrome router on Base: 0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43
      const aerodromeRouter = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43";
      
      // Mock quote calculation - replace with actual Aerodrome API calls
      const mockOutputAmount = (parseFloat(amountIn) * 0.998).toString(); // 0.2% slippage
      
      return {
        inputAmount: amountIn,
        outputAmount: mockOutputAmount,
        priceImpact: 0.15,
        fees: (parseFloat(amountIn) * 0.003).toString(),
        route: [tokenIn, tokenOut],
        estimatedGas: "150000"
      };
    } catch (error) {
      console.error("Error getting Aerodrome quote:", error);
      return null;
    }
  }

  // Jupiter Solana DEX Integration
  async getJupiterQuote(
    inputMint: string,
    outputMint: string,
    amount: string
  ): Promise<DEXQuote | null> {
    try {
      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`
      );
      
      if (!response.ok) {
        throw new Error("Jupiter API request failed");
      }
      
      const data = await response.json();
      
      return {
        inputAmount: data.inAmount,
        outputAmount: data.outAmount,
        priceImpact: data.priceImpactPct || 0,
        fees: data.feeAmount || "0",
        route: data.routePlan?.map((step: any) => step.swapInfo.label) || []
      };
    } catch (error) {
      console.error("Error getting Jupiter quote:", error);
      return null;
    }
  }

  // Get all trading pairs from database
  async getTradingPairs(): Promise<DEXTradingPair[]> {
    try {
      const { data, error } = await supabase
        .from("dex_trading_pairs")
        .select("*")
        .eq("is_active", true)
        .order("liquidity_usd", { ascending: false });

      if (error) {
        console.error("Error fetching trading pairs:", error);
        return [];
      }

      return data.map(row => ({
        baseTokenId: row.base_token_id,
        baseSymbol: row.base_symbol,
        baseName: row.base_name,
        ticker: row.ticker,
        blockchain: row.blockchain,
        contractAddress: row.contract_address,
        aerodromePoolAddress: row.aerodrome_pool_address,
        jupiterMintAddress: row.jupiter_mint_address,
        liquidityUsd: parseFloat(row.liquidity_usd?.toString() || "0"),
        dailyVolumeUsd: parseFloat(row.daily_volume_usd?.toString() || "0"),
        isActive: row.is_active,
        pairTokenId: row.pair_token_id,
        pairSymbol: row.pair_symbol,
        pairBlockchain: row.pair_blockchain,
        pairContractAddress: row.pair_contract_address
      }));
    } catch (error) {
      console.error("Error in getTradingPairs:", error);
      return [];
    }
  }

  // Get token balance for a wallet
  async getTokenBalance(
    walletAddress: string,
    tokenAddress: string,
    blockchain: "base" | "solana"
  ): Promise<string> {
    try {
      if (blockchain === "base") {
        // Mock Base token balance - replace with actual Web3 calls
        return (Math.random() * 1000).toFixed(2);
      } else {
        // Mock Solana token balance - replace with actual Solana calls
        return (Math.random() * 1000).toFixed(2);
      }
    } catch (error) {
      console.error("Error getting token balance:", error);
      return "0";
    }
  }

  // Execute swap on Aerodrome
  async executeAerodromeSwap(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    minAmountOut: string,
    walletAddress: string
  ): Promise<string | null> {
    try {
      // This would interact with Aerodrome contracts
      console.log("Executing Aerodrome swap:", {
        tokenIn,
        tokenOut,
        amountIn,
        minAmountOut,
        walletAddress
      });
      
      // Return mock transaction hash
      return "0x" + Math.random().toString(16).slice(2, 66);
    } catch (error) {
      console.error("Error executing Aerodrome swap:", error);
      return null;
    }
  }

  // Execute swap on Jupiter
  async executeJupiterSwap(
    swapTransaction: string,
    walletAddress: string
  ): Promise<string | null> {
    try {
      // This would interact with Jupiter API and Solana
      console.log("Executing Jupiter swap:", {
        swapTransaction,
        walletAddress
      });
      
      // Return mock transaction signature
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    } catch (error) {
      console.error("Error executing Jupiter swap:", error);
      return null;
    }
  }

  // Calculate arbitrage opportunities
  async getArbitrageOpportunities(): Promise<any[]> {
    const pairs = await this.getTradingPairs();
    const opportunities = [];

    // Group pairs by ticker
    const pairsByTicker = pairs.reduce((acc, pair) => {
      if (!acc[pair.ticker]) acc[pair.ticker] = [];
      acc[pair.ticker].push(pair);
      return acc;
    }, {} as Record<string, DEXTradingPair[]>);

    // Find cross-chain arbitrage opportunities
    for (const [ticker, tokenPairs] of Object.entries(pairsByTicker)) {
      if (tokenPairs.length >= 2) {
        const basePair = tokenPairs.find(p => p.blockchain === "base");
        const solanaPair = tokenPairs.find(p => p.blockchain === "solana");
        
        if (basePair && solanaPair) {
          // Mock price difference calculation
          const priceDiff = Math.random() * 5 - 2.5; // -2.5% to +2.5%
          
          if (Math.abs(priceDiff) > 0.5) { // Only show significant opportunities
            opportunities.push({
              ticker,
              basePair,
              solanaPair,
              priceDifferencePercent: priceDiff,
              profitPotential: Math.abs(priceDiff) - 0.3 // Minus estimated fees
            });
          }
        }
      }
    }

    return opportunities.sort((a, b) => 
      Math.abs(b.priceDifferencePercent) - Math.abs(a.priceDifferencePercent)
    );
  }
}

export const dexService = new DEXService();