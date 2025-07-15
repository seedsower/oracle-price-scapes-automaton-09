import { useState, useEffect } from "react";
import { CommodityCategory, CommodityPrice } from "@/types";
import { PriceChart } from "@/components/PriceChart";
import { TradingCard } from "@/components/TradingCard";
import { ArbitrageOpportunities } from "@/components/ArbitrageOpportunities";
import { OracleStatus } from "@/components/OracleStatus";
import { WalletConnection } from "@/components/WalletConnection";
import { priceService } from "@/services/priceService";
import { dexService } from "@/services/dexService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2Icon, RefreshCwIcon, FolderIcon } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [commodities, setCommodities] = useState<CommodityPrice[]>([]);
  const [tradingPairs, setTradingPairs] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [autoUpdateActive, setAutoUpdateActive] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch commodity prices when component mounts or category changes
  useEffect(() => {
    fetchPrices();
    fetchTradingPairs();
  }, [selectedCategory]);

  // Function to fetch prices based on selected category
  const fetchPrices = async () => {
    try {
      setIsLoading(true);
      let prices: CommodityPrice[];
      
      if (selectedCategory === "all") {
        prices = await priceService.fetchCommodityPrices();
      } else {
        prices = await priceService.fetchCommodityPricesByCategory(
          selectedCategory as CommodityCategory
        );
      }
      
      setCommodities(prices);
      setLastUpdated(priceService.getLastScrapedTime());
    } catch (error) {
      console.error("Error fetching prices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTradingPairs = async () => {
    try {
      const pairs = await dexService.getTradingPairs();
      setTradingPairs(pairs);
    } catch (error) {
      console.error("Error fetching trading pairs:", error);
    }
  };

  // Handle tab change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await priceService.scrapePrices();
      await priceService.updateOracles();
      await fetchPrices();
      await fetchTradingPairs();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Toggle automatic updates
  const toggleAutomaticUpdates = () => {
    if (autoUpdateActive) {
      priceService.stopAutomaticUpdates();
      setAutoUpdateActive(false);
    } else {
      priceService.startAutomaticUpdates(fetchPrices);
      setAutoUpdateActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="relative bg-muted/30 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold sm:text-4xl">Synthetic Commodities DEX</h1>
              <p className="max-w-3xl text-muted-foreground">
                Trade synthetic commodity tokens on Base (Aerodrome) and Solana (Jupiter) with real-time arbitrage opportunities.
              </p>
            </div>

            <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 lg:items-center">
              <div className="flex gap-2">
                <Button 
                  onClick={handleRefresh} 
                  variant="secondary" 
                  className="gap-2" 
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCwIcon className="h-4 w-4" />
                  )}
                  Refresh Markets
                </Button>
                
                <Button 
                  onClick={toggleAutomaticUpdates} 
                  variant={autoUpdateActive ? "destructive" : "outline"} 
                  className="gap-2"
                >
                  {autoUpdateActive ? "Stop Auto-Updates" : "Start Auto-Updates"}
                </Button>
              </div>

              <div className="flex flex-col space-y-2 sm:items-end">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/portfolio')} 
                    variant="outline" 
                    className="gap-2"
                  >
                    <FolderIcon className="h-4 w-4" />
                    Portfolio
                  </Button>
                </div>
                {lastUpdated && (
                  <div className="text-sm text-muted-foreground">
                    Last updated: {lastUpdated.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <WalletConnection />
            <ArbitrageOpportunities />
          </div>
          <div className="lg:col-span-2">
            <OracleStatus oracle={{
              id: "synthetic-oracle",
              commodityId: "synthetic",
              latestPrice: 0,
              lastUpdated: new Date().toISOString(),
              nextUpdateTime: new Date(Date.now() + 60000).toISOString(),
              status: "Active" as any,
              network: "Multi-Chain",
              address: "0x...",
              transactions: []
            }} />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="metals">Metals</TabsTrigger>
            <TabsTrigger value="agriculture">Agriculture</TabsTrigger>
            <TabsTrigger value="livestock">Livestock</TabsTrigger>
            <TabsTrigger value="softs">Softs</TabsTrigger>
            <TabsTrigger value="tradeable">Tradeable</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted h-48 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commodities
                  .filter(commodity => {
                    if (selectedCategory === "tradeable") {
                      return tradingPairs.some(pair => 
                        pair.ticker === commodity.ticker
                      );
                    }
                    return true;
                  })
                  .map((commodity) => {
                    const tradingPair = tradingPairs.find(pair => 
                      pair.ticker === commodity.ticker
                    );
                    
                    return (
                      <TradingCard 
                        key={commodity.id} 
                        commodity={commodity}
                        tradingPair={tradingPair}
                        showDetails={false}
                      />
                    );
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;