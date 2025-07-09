
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
    const mockTokens: Record<string, { 
      ethereum: { available: boolean; tokenPrice: number; symbol: string };
      solana: { available: boolean; tokenPrice: number; symbol: string };
    }> = {
      'crude-oil': { 
        ethereum: { available: true, tokenPrice: 72.45, symbol: 'tOIL' },
        solana: { available: true, tokenPrice: 72.52, symbol: 'SOL-OIL' }
      },
      'gold': { 
        ethereum: { available: true, tokenPrice: 2031.50, symbol: 'tGLD' },
        solana: { available: true, tokenPrice: 2032.10, symbol: 'SOL-GLD' }
      },
      'silver': { 
        ethereum: { available: true, tokenPrice: 23.85, symbol: 'tSLV' },
        solana: { available: false, tokenPrice: 0, symbol: 'SOL-SLV' }
      },
      'wheat': { 
        ethereum: { available: false, tokenPrice: 0, symbol: 'tWHT' },
        solana: { available: true, tokenPrice: 5.87, symbol: 'SOL-WHT' }
      },
      'corn': { 
        ethereum: { available: true, tokenPrice: 4.32, symbol: 'tCRN' },
        solana: { available: true, tokenPrice: 4.35, symbol: 'SOL-CRN' }
      },
    };
    return mockTokens[commodityId] || { 
      ethereum: { available: false, tokenPrice: 0, symbol: 'tTKN' },
      solana: { available: false, tokenPrice: 0, symbol: 'SOL-TKN' }
    };
  };
  
  const tokenInfo = getTokenInfo(id);
  const ethTokenAvailable = tokenInfo.ethereum.available;
  const solTokenAvailable = tokenInfo.solana.available;
  const anyTokenAvailable = ethTokenAvailable || solTokenAvailable;
  
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CoinsIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tokens</span>
                <Badge 
                  variant={anyTokenAvailable ? "default" : "secondary"}
                  className="text-xs"
                >
                  {anyTokenAvailable ? "Available" : "Coming Soon"}
                </Badge>
              </div>
            </div>
            
            {/* Ethereum Tokens */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Ethereum (Base):</span>
                <div className="flex items-center gap-1">
                  <Badge variant={ethTokenAvailable ? "outline" : "secondary"} className="text-xs">
                    {tokenInfo.ethereum.symbol}
                  </Badge>
                  {ethTokenAvailable && (
                    <span className="font-medium">${tokenInfo.ethereum.tokenPrice}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Solana Tokens */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Solana:</span>
                <div className="flex items-center gap-1">
                  <Badge variant={solTokenAvailable ? "outline" : "secondary"} className="text-xs">
                    {tokenInfo.solana.symbol}
                  </Badge>
                  {solTokenAvailable && (
                    <span className="font-medium">${tokenInfo.solana.tokenPrice}</span>
                  )}
                </div>
              </div>
            </div>
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
              variant={anyTokenAvailable ? "default" : "secondary"}
              size="sm" 
              className="flex-1 justify-center gap-2 text-xs"
              disabled={!anyTokenAvailable}
              onClick={() => console.log(`Tokenize ${name} on multiple chains`)} // TODO: Implement multi-chain tokenization
            >
              <CoinsIcon className="h-3.5 w-3.5" />
              {anyTokenAvailable ? "Tokenize" : "Coming Soon"}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
