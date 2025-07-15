import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { TrendingUp, TrendingDown, ExternalLink, Zap, ArrowLeftRight } from "lucide-react";
import { dexService, DEXTradingPair, DEXQuote } from "@/services/dexService";
import { CommodityPrice } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface TradingCardProps {
  commodity: CommodityPrice;
  tradingPair?: DEXTradingPair;
  showDetails?: boolean;
}

export const TradingCard = ({ commodity, tradingPair, showDetails = false }: TradingCardProps) => {
  const navigate = useNavigate();
  const { address: ethAddress, isConnected: isEthConnected } = useAccount();
  const { publicKey: solanaAddress, connected: isSolanaConnected } = useWallet();
  const { toast } = useToast();
  
  const [swapAmount, setSwapAmount] = useState<string>("");
  const [quote, setQuote] = useState<DEXQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string>("0");
  const [selectedChain, setSelectedChain] = useState<"base" | "solana">("base");

  // Determine if trading is available
  const hasBaseContract = tradingPair?.blockchain === "base" && tradingPair?.contractAddress;
  const hasSolanaContract = tradingPair?.blockchain === "solana" && tradingPair?.contractAddress;
  const canTrade = hasBaseContract || hasSolanaContract;

  // Format large numbers
  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  // Calculate price difference vs traditional market
  const mockDexPrice = commodity.price * (1 + (Math.random() * 0.1 - 0.05)); // ±5% variance
  const priceDifference = ((mockDexPrice - commodity.price) / commodity.price) * 100;

  // Get quote when amount changes
  useEffect(() => {
    if (swapAmount && tradingPair && parseFloat(swapAmount) > 0) {
      getSwapQuote();
    }
  }, [swapAmount, selectedChain, tradingPair]);

  // Load balance
  useEffect(() => {
    if (tradingPair && ((selectedChain === "base" && isEthConnected) || (selectedChain === "solana" && isSolanaConnected))) {
      loadBalance();
    }
  }, [tradingPair, selectedChain, isEthConnected, isSolanaConnected]);

  const getSwapQuote = async () => {
    if (!tradingPair || !swapAmount) return;
    
    setIsLoading(true);
    try {
      let quote: DEXQuote | null = null;
      
      if (selectedChain === "base" && hasBaseContract) {
        // Use USDC as quote token for Base
        const usdcBase = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
        quote = await dexService.getAerodromeQuote(
          usdcBase,
          tradingPair.contractAddress,
          (parseFloat(swapAmount) * 1e6).toString() // USDC has 6 decimals
        );
      } else if (selectedChain === "solana" && hasSolanaContract) {
        // Use USDC as quote token for Solana
        const usdcSolana = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
        quote = await dexService.getJupiterQuote(
          usdcSolana,
          tradingPair.contractAddress,
          (parseFloat(swapAmount) * 1e6).toString()
        );
      }
      
      setQuote(quote);
    } catch (error) {
      console.error("Error getting quote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBalance = async () => {
    if (!tradingPair) return;
    
    const address = selectedChain === "base" ? ethAddress : solanaAddress?.toString();
    if (!address) return;

    const balance = await dexService.getTokenBalance(
      address,
      tradingPair.contractAddress,
      selectedChain
    );
    setBalance(balance);
  };

  const handleTrade = async () => {
    if (!quote || !tradingPair || !swapAmount) return;
    
    const address = selectedChain === "base" ? ethAddress : solanaAddress?.toString();
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: `Please connect your ${selectedChain === "base" ? "Ethereum" : "Solana"} wallet to trade.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let txHash: string | null = null;
      
      if (selectedChain === "base") {
        const usdcBase = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
        txHash = await dexService.executeAerodromeSwap(
          usdcBase,
          tradingPair.contractAddress,
          quote.inputAmount,
          quote.outputAmount,
          address
        );
      } else {
        // For Jupiter, we'd need to get the swap transaction first
        txHash = await dexService.executeJupiterSwap("mock_transaction", address);
      }

      if (txHash) {
        toast({
          title: "Trade successful!",
          description: `Transaction hash: ${txHash.slice(0, 10)}...`,
        });
        
        // Record transaction in database
        // This would be handled by the trade-commodity edge function
        
        setSwapAmount("");
        setQuote(null);
      } else {
        throw new Error("Failed to execute trade");
      }
    } catch (error) {
      console.error("Trade failed:", error);
      toast({
        title: "Trade failed",
        description: "Please try again or check your wallet connection.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold text-foreground">
              {commodity.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {commodity.ticker || 'N/A'}
              </Badge>
              {canTrade && (
                <Badge variant="secondary" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Tradeable
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              ${commodity.price.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              {commodity.unit}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Movement */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {commodity.changePercent >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              commodity.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {commodity.changePercent >= 0 ? '+' : ''}{commodity.changePercent}%
            </span>
          </div>
          
          {/* DEX Price Comparison */}
          {canTrade && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">DEX Price</div>
              <div className={`text-sm font-medium ${
                priceDifference >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                ${mockDexPrice.toFixed(2)} ({priceDifference >= 0 ? '+' : ''}{priceDifference.toFixed(2)}%)
              </div>
            </div>
          )}
        </div>

        {/* Trading Section */}
        {canTrade && (
          <>
            <Separator />
            <Tabs value={selectedChain} onValueChange={(value) => setSelectedChain(value as "base" | "solana")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="base" disabled={!hasBaseContract}>
                  Base
                </TabsTrigger>
                <TabsTrigger value="solana" disabled={!hasSolanaContract}>
                  Solana
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedChain} className="space-y-3 mt-4">
                {/* Liquidity Info */}
                {tradingPair && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Liquidity</div>
                      <div className="font-medium">{formatLargeNumber(tradingPair.liquidityUsd)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">24h Volume</div>
                      <div className="font-medium">{formatLargeNumber(tradingPair.dailyVolumeUsd)}</div>
                    </div>
                  </div>
                )}

                {/* Trading Interface */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Amount (USDC)</label>
                      <span className="text-xs text-muted-foreground">
                        Balance: {balance} {commodity.ticker}
                      </span>
                    </div>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Quote Display */}
                  {quote && (
                    <div className="p-3 border rounded-lg bg-muted/50 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">You receive</span>
                        <span className="font-medium">
                          {(parseFloat(quote.outputAmount) / 1e18).toFixed(6)} {commodity.ticker}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price impact</span>
                        <span className={`font-medium ${quote.priceImpact > 1 ? 'text-red-500' : 'text-green-500'}`}>
                          {quote.priceImpact.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fees</span>
                        <span className="font-medium">${(parseFloat(quote.fees) / 1e6).toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleTrade}
                    disabled={!quote || isLoading || !swapAmount}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      "Processing..."
                    ) : (
                      <>
                        <ArrowLeftRight className="w-4 h-4 mr-2" />
                        Buy {commodity.ticker}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Action Buttons */}
        <Separator />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/commodity/${commodity.id}`)}
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Details
          </Button>
          
          {!canTrade && (
            <Button variant="outline" size="sm" disabled className="flex-1">
              Coming Soon
            </Button>
          )}
        </div>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center pt-2">
          Updated: {new Date(commodity.lastUpdate).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};