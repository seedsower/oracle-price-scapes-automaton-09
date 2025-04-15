
import { CommodityPrice } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, BarChart3Icon, LinkIcon } from "lucide-react";
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
        <div className="flex flex-col space-y-2">
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
          <div className="text-xs text-muted-foreground">
            Updated: {formattedDate}
          </div>
        </div>
      </CardContent>
      
      {showDetails && (
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-xs"
            onClick={() => navigate(`/commodity/${id}`)}
          >
            <LinkIcon className="h-3.5 w-3.5" />
            View Oracle Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
