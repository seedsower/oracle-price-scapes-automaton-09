import { useState, useEffect } from "react";
import { CommodityPrice } from "@/types";
import { usePortfolio } from "@/hooks/usePortfolio";
import { priceService } from "@/services/priceService";
import { WalletConnection } from "@/components/WalletConnection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon, TrendingDownIcon, CoinsIcon, RefreshCwIcon, ArrowLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Portfolio = () => {
  const navigate = useNavigate();
  const [commodities, setCommodities] = useState<CommodityPrice[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { portfolio, positions, isLoading, error, refreshPortfolio } = usePortfolio(commodities);

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const prices = await priceService.fetchCommodityPrices();
        setCommodities(prices);
      } catch (error) {
        console.error("Error fetching commodity prices:", error);
      }
    };

    fetchCommodities();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshPortfolio();
    setIsRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getNetworkBadgeVariant = (network: string) => {
    return network === 'base' ? 'default' : 'secondary';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="relative bg-muted/30 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold sm:text-4xl">Portfolio</h1>
                <p className="max-w-3xl text-muted-foreground">
                  Track your tokenized commodity positions and monitor profit & loss across multiple blockchains.
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex gap-2">
                <Button 
                  onClick={handleRefresh} 
                  variant="secondary" 
                  className="gap-2" 
                  disabled={isRefreshing}
                >
                  <RefreshCwIcon className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                  Refresh Portfolio
                </Button>
              </div>
              <WalletConnection />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="text-center space-y-2">
              <CoinsIcon className="h-8 w-8 animate-pulse text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Loading portfolio...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Portfolio Summary */}
            {portfolio && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Portfolio Value</CardDescription>
                    <CardTitle className="text-2xl">
                      {formatCurrency(portfolio.totalValue)}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total P&L</CardDescription>
                    <CardTitle className={cn(
                      "text-2xl flex items-center gap-2",
                      portfolio.totalProfitLoss >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {portfolio.totalProfitLoss >= 0 ? (
                        <TrendingUpIcon className="h-5 w-5" />
                      ) : (
                        <TrendingDownIcon className="h-5 w-5" />
                      )}
                      {formatCurrency(portfolio.totalProfitLoss)}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total P&L %</CardDescription>
                    <CardTitle className={cn(
                      "text-2xl",
                      portfolio.totalProfitLossPercent >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {formatPercent(portfolio.totalProfitLossPercent)}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
            )}

            {/* Positions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CoinsIcon className="h-5 w-5" />
                  Token Positions
                </CardTitle>
                <CardDescription>
                  Your tokenized commodity holdings across Base and Solana
                </CardDescription>
              </CardHeader>
              <CardContent>
                {positions.length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <CoinsIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">No positions found</p>
                    <Button onClick={() => navigate('/')} variant="outline">
                      Explore Commodities
                    </Button>
                  </div>
                ) : (
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Positions</TabsTrigger>
                      <TabsTrigger value="base">Base Network</TabsTrigger>
                      <TabsTrigger value="solana">Solana Network</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                      {positions.map((position) => (
                        <PositionCard key={position.id} position={position} />
                      ))}
                    </TabsContent>

                    <TabsContent value="base" className="space-y-4">
                      {positions.filter(p => p.network === 'base').map((position) => (
                        <PositionCard key={position.id} position={position} />
                      ))}
                    </TabsContent>

                    <TabsContent value="solana" className="space-y-4">
                      {positions.filter(p => p.network === 'solana').map((position) => (
                        <PositionCard key={position.id} position={position} />
                      ))}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Position Card Component
const PositionCard = ({ position }: { position: any }) => {
  const isProfit = position.profitLoss >= 0;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg">{position.commodityName}</h3>
              <Badge variant="outline" className="text-xs">
                {position.ticker}
              </Badge>
              <Badge variant={position.network === 'base' ? 'default' : 'secondary'} className="text-xs">
                {position.network === 'base' ? 'Base' : 'Solana'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              {position.contractAddress.slice(0, 6)}...{position.contractAddress.slice(-4)}
            </p>
          </div>

          <div className="text-right space-y-1">
            <p className="text-2xl font-bold">
              ${position.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isProfit ? "text-success" : "text-destructive"
            )}>
              {isProfit ? (
                <ArrowUpIcon className="h-3 w-3" />
              ) : (
                <ArrowDownIcon className="h-3 w-3" />
              )}
              ${Math.abs(position.profitLoss).toLocaleString('en-US', { minimumFractionDigits: 2 })} 
              ({isProfit ? '+' : ''}{position.profitLossPercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Balance</p>
            <p className="font-medium">{position.balance.toFixed(3)} tokens</p>
          </div>
          <div>
            <p className="text-muted-foreground">Purchase Price</p>
            <p className="font-medium">${position.purchasePrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current Price</p>
            <p className="font-medium">${position.currentPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Purchase Date</p>
            <p className="font-medium">{new Date(position.purchaseDate).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Portfolio;