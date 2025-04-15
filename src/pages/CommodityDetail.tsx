
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CommodityPrice, OracleData, PriceHistory } from "@/types";
import { PriceCard } from "@/components/PriceCard";
import { PriceChart } from "@/components/PriceChart";
import { OracleStatus } from "@/components/OracleStatus";
import { Button } from "@/components/ui/button";
import { priceService } from "@/services/priceService";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";

const CommodityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [commodity, setCommodity] = useState<CommodityPrice | null>(null);
  const [oracle, setOracle] = useState<OracleData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Function to load all required data
  const loadData = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      
      // Fetch all required data in parallel
      const [commodityData, oracleData, historyData] = await Promise.all([
        priceService.fetchCommodity(id),
        priceService.fetchOracleForCommodity(id),
        priceService.fetchPriceHistory(id),
      ]);
      
      if (!commodityData) {
        navigate("/");
        return;
      }
      
      setCommodity(commodityData);
      setOracle(oracleData || null);
      setPriceHistory(historyData || null);
    } catch (error) {
      console.error("Error loading commodity data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await priceService.scrapePrices();
    await priceService.updateOracles();
    await loadData();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2Icon className="h-12 w-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!commodity || !oracle || !priceHistory) {
    return (
      <div className="mx-auto max-w-7xl py-12 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Commodity Not Found</h1>
          <Button onClick={() => navigate("/")} className="gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-muted/30 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col space-y-4">
            <Button 
              variant="ghost" 
              className="w-fit gap-2" 
              onClick={() => navigate("/")}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{commodity.name}</h1>
              <p className="text-muted-foreground">
                Detailed price information and oracle status
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PriceCard commodity={commodity} showDetails={false} />
            
            <div className="mt-6">
              <Button 
                onClick={handleRefresh} 
                className="w-full gap-2" 
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <span>Refresh Data</span>
                )}
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <PriceChart priceHistory={priceHistory} />
            <OracleStatus oracle={oracle} onRefresh={handleRefresh} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommodityDetail;
