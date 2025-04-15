
import { PriceHistory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, TooltipProps 
} from "recharts";
import { cn } from "@/lib/utils";

interface PriceChartProps {
  priceHistory: PriceHistory;
  title?: string;
  className?: string;
  height?: number;
}

export function PriceChart({ 
  priceHistory, 
  title = "Price History (24h)", 
  className,
  height = 300 
}: PriceChartProps) {
  
  // Create data points for the chart
  const data = priceHistory.timestamps.map((timestamp, index) => ({
    time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    price: priceHistory.prices[index],
    fullTime: timestamp
  }));
  
  // Calculate min and max values for the y-axis with some padding
  const prices = priceHistory.prices;
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  
  // Determine if the trend is positive by comparing first and last price
  const isPositive = prices[prices.length - 1] >= prices[0];
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip rounded-md border border-border bg-card p-2 shadow-sm">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-medium">
            <span>Price: </span>
            <span>{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px`, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                tickMargin={10}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                domain={[minPrice, maxPrice]}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => value.toFixed(2)}
                width={50}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
