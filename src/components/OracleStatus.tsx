
import { OracleData, OracleStatus as OracleStatusType, OracleTransaction } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClockIcon, HistoryIcon, RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface OracleStatusProps {
  oracle: OracleData;
  onRefresh?: () => void;
  className?: string;
}

export function OracleStatus({ oracle, onRefresh, className }: OracleStatusProps) {
  const { 
    network, address, status, latestPrice, 
    lastUpdated, nextUpdateTime, transactions 
  } = oracle;
  
  const statusColor = {
    [OracleStatusType.Active]: "bg-success/20 text-success",
    [OracleStatusType.Pending]: "bg-warning/20 text-warning",
    [OracleStatusType.Failed]: "bg-destructive/20 text-destructive",
  };

  const formattedLastUpdated = new Date(lastUpdated).toLocaleString();
  const formattedNextUpdate = new Date(nextUpdateTime).toLocaleString();
  const timeUntilNextUpdate = getTimeUntilNextUpdate(nextUpdateTime);

  function getTimeUntilNextUpdate(nextUpdateTime: string): string {
    const now = new Date();
    const next = new Date(nextUpdateTime);
    const diffMs = next.getTime() - now.getTime();
    
    if (diffMs < 0) return "Updating soon...";
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }
  
  // Format transaction time relative to now (e.g. "2 hours ago")
  function formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const txTime = new Date(timestamp);
    const diffMs = now.getTime() - txTime.getTime();
    
    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Blockchain Oracle</CardTitle>
              <CardDescription>{network} Network</CardDescription>
            </div>
            <Badge variant="outline" className={cn("text-xs", statusColor[status])}>
              {status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Oracle Address</p>
              <p className="text-sm font-medium break-all">{address}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Latest Price</p>
              <p className="text-sm font-medium">{latestPrice}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-sm">{formattedLastUpdated}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <p className="text-xs text-muted-foreground">Next Update</p>
                <ClockIcon className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs font-medium text-accent">{timeUntilNextUpdate}</p>
              </div>
              <p className="text-sm">{formattedNextUpdate}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <HistoryIcon className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Recent Transactions</h4>
              </div>
              {onRefresh && (
                <Button variant="ghost" size="sm" onClick={onRefresh}>
                  <RefreshCwIcon className="h-3.5 w-3.5 mr-1" />
                  Refresh
                </Button>
              )}
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Time</TableHead>
                    <TableHead>TX Hash</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 5).map((tx) => (
                    <TableRow key={tx.txHash}>
                      <TableCell className="text-xs">{formatTimeAgo(tx.timestamp)}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {tx.txHash.substring(0, 10)}...{tx.txHash.substring(tx.txHash.length - 6)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant="outline"
                          className={cn(
                            "text-xs",
                            tx.newPrice >= tx.oldPrice ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                          )}
                        >
                          {tx.newPrice}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Data updated automatically every 6 hours
        </p>
      </CardFooter>
    </Card>
  );
}
