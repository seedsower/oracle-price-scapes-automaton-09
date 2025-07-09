
import { CommodityPrice } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon, BarChart3Icon, LinkIcon, CoinsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface PriceCardProps {
  commodity: CommodityPrice;
  showDetails?: boolean;
}

export function PriceCard({ commodity, showDetails = true }: PriceCardProps) {
  const navigate = useNavigate();
  const { id, name, price, unit, change, changePercent, lastUpdate, category } = commodity;
  
  const formattedDate = new Date(lastUpdate).toLocaleString();
  const isPositive = change >= 0;
  
  // Mock token data - in real implementation, this would come from API
  const getTokenInfo = (commodityId: string) => {
    const mockTokens: Record<string, { available: boolean; tokenPrice: number; symbol: string }> = {
      'crude-oil': { available: true, tokenPrice: 72.45, symbol: 'tOIL' },
      'gold': { available: true, tokenPrice: 2031.50, symbol: 'tGLD' },
      'silver': { available: true, tokenPrice: 23.85, symbol: 'tSLV' },
      'wheat': { available: false, tokenPrice: 0, symbol: 'tWHT' },
      'corn': { available: true, tokenPrice: 4.32, symbol: 'tCRN' },
    };
    return mockTokens[commodityId] || { available: false, tokenPrice: 0, symbol: 'tTKN' };
  };
  
  const tokenInfo = getTokenInfo(id);
  const tokenPriceDiff = tokenInfo.tokenPrice - price;
  const tokenPriceDiffPercent = tokenInfo.tokenPrice > 0 ? ((tokenPriceDiff / price) * 100) : 0;
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg md:text-xl">{name}</CardTitle>
            <CardDescription>{category}</CardDescription>
          </div>
          <div className="rounded-full bg-muted p-1.5">
            <BarChart3Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <div className="flex items-end justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold">{price}</span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
            <div 
              className={cn(
                "flex items-center space-x-1 rounded-md px-1.5 py-0.5",
                isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
              )}
            >
              {isPositive ? (
                <ArrowUpIcon className="h-3 w-3" />
              ) : (
                <ArrowDownIcon className="h-3 w-3" />
              )}
              <span className="text-xs font-medium">
                {isPositive ? "+" : ""}{change} ({isPositive ? "+" : ""}{changePercent}%)
              </span>
            </div>
          </div>
          
          {/* Token Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CoinsIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Token</span>
                <Badge 
                  variant={tokenInfo.available ? "default" : "secondary"}
                  className="text-xs"
                >
                  {tokenInfo.available ? "Available" : "Coming Soon"}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">{tokenInfo.symbol}</span>
            </div>
            
            {tokenInfo.available && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Token Price:</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{tokenInfo.tokenPrice}</span>
                  <span 
                    className={cn(
                      "text-xs",
                      tokenPriceDiff >= 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    ({tokenPriceDiff >= 0 ? "+" : ""}{tokenPriceDiffPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            Updated: {formattedDate}
          </div>
        </div>
      </CardContent>
      
      {showDetails && (
        <CardFooter className="pt-0 flex-col gap-2">
          <div className="flex w-full gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 justify-start gap-2 text-xs"
              onClick={() => navigate(`/commodity/${id}`)}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              View Oracle Details
            </Button>
            <Button 
              variant={tokenInfo.available ? "default" : "secondary"}
              size="sm" 
              className="flex-1 justify-center gap-2 text-xs"
              disabled={!tokenInfo.available}
              onClick={() => console.log(`Tokenize ${name}`)} // TODO: Implement tokenization
            >
              <CoinsIcon className="h-3.5 w-3.5" />
              {tokenInfo.available ? "Tokenize" : "Coming Soon"}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
