import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, ArrowRight, RefreshCw } from "lucide-react";
import { dexService } from "@/services/dexService";

interface ArbitrageOpportunity {
  ticker: string;
  basePair: any;
  solanaPair: any;
  priceDifferencePercent: number;
  profitPotential: number;
}

export const ArbitrageOpportunities = () => {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadOpportunities = async () => {
    setIsLoading(true);
    try {
      const data = await dexService.getArbitrageOpportunities();
      setOpportunities(data);
    } catch (error) {
      console.error("Error loading arbitrage opportunities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadOpportunities, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  if (opportunities.length === 0 && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Cross-Chain Arbitrage
            <Button variant="outline" size="sm" onClick={loadOpportunities}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No significant arbitrage opportunities found at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cross-Chain Arbitrage Opportunities</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadOpportunities}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Price differences between Base and Solana markets
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {opportunities.map((opportunity, index) => (
          <div key={`${opportunity.ticker}-${index}`} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-mono">
                  {opportunity.ticker}
                </Badge>
                <div className="flex items-center gap-2">
                  {opportunity.priceDifferencePercent >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`font-medium ${
                    opportunity.priceDifferencePercent >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {opportunity.priceDifferencePercent >= 0 ? '+' : ''}
                    {opportunity.priceDifferencePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <Badge 
                variant={opportunity.profitPotential > 1 ? "default" : "secondary"}
                className="font-medium"
              >
                {opportunity.profitPotential.toFixed(2)}% profit
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {/* Base Chain Info */}
              <div className="space-y-1">
                <div className="font-medium text-blue-500">Base Network</div>
                <div className="text-muted-foreground">
                  Liquidity: {formatLargeNumber(opportunity.basePair.liquidityUsd)}
                </div>
                <div className="text-muted-foreground">
                  Volume: {formatLargeNumber(opportunity.basePair.dailyVolumeUsd)}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>

              {/* Solana Chain Info */}
              <div className="space-y-1">
                <div className="font-medium text-purple-500">Solana Network</div>
                <div className="text-muted-foreground">
                  Liquidity: {formatLargeNumber(opportunity.solanaPair.liquidityUsd)}
                </div>
                <div className="text-muted-foreground">
                  Volume: {formatLargeNumber(opportunity.solanaPair.dailyVolumeUsd)}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Analyze Route
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                disabled={opportunity.profitPotential < 0.5}
              >
                Execute Arbitrage
              </Button>
            </div>

            {index < opportunities.length - 1 && <Separator />}
          </div>
        ))}

        {isLoading && (
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
              Scanning for opportunities...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};