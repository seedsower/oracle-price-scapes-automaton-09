
import { CommodityCategory, CommodityPrice, OracleData, OracleStatus, OracleTransaction, PriceHistory } from "@/types";

// Mock commodity data
export const mockCommodities: CommodityPrice[] = [
  {
    id: "crude-oil",
    name: "Crude Oil",
    price: 78.23,
    unit: "USD/bbl",
    change: -1.45,
    changePercent: -1.82,
    lastUpdate: new Date().toISOString(),
    category: CommodityCategory.Energy
  },
  {
    id: "brent-oil",
    name: "Brent Oil",
    price: 82.14,
    unit: "USD/bbl",
    change: -1.32,
    changePercent: -1.58,
    lastUpdate: new Date().toISOString(),
    category: CommodityCategory.Energy
  },
  {
    id: "natural-gas",
    name: "Natural Gas",
    price: 2.82,
    unit: "USD/MMBtu",
    change: 0.04,
    changePercent: 1.44,
    lastUpdate: new Date().toISOString(),
    category: CommodityCategory.Energy
  },
  {
    id: "gold",
    name: "Gold",
    price: 2316.75,
    unit: "USD/t oz",
    change: 15.34,
    changePercent: 0.67,
    lastUpdate: new Date().toISOString(),
    category: CommodityCategory.Metals
  },
  {
    id: "silver",
    name: "Silver",
    price: 27.20,
    unit: "USD/t oz",
    change: 0.53,
    changePercent: 1.99,
    lastUpdate: new Date().toISOString(),
    category: CommodityCategory.Metals
  },
  {
    id: "copper",
    name: "Copper",
    price: 4.52,
    unit: "USD/lbs",
    change: -0.06,
    changePercent: -1.31,
    lastUpdate: new Date().toISOString(),
    category: CommodityCategory.Metals
  },
  {
    id: "wheat",
    name: "Wheat",
    price: 598.75,
    unit: "USD/bu",
    change: -12.25,
    changePercent: -2.01,
    lastUpdate: new Date().toISOString(),
    category: CommodityCategory.Agriculture
  },
  {
    id: "corn",
    name: "Corn",
    price: 442.25,
    unit: "USD/bu",
    change: -3.50,
    changePercent: -0.78,
    lastUpdate: new Date().toISOString(),
    category: CommodityCategory.Agriculture
  },
  {
    id: "cotton",
    name: "Cotton",
    price: 78.20,
    unit: "USD/lbs",
    change: 0.14,
    changePercent: 0.18,
    lastUpdate: new Date().toISOString(),
    category: CommodityCategory.Agriculture
  }
];

// Generate random blockchain address
export const generateAddress = () => {
  let addr = '0x';
  const chars = '0123456789abcdef';
  for (let i = 0; i < 40; i++) {
    addr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return addr;
};

// Generate random transaction hash
export const generateTxHash = () => {
  let hash = '0x';
  const chars = '0123456789abcdef';
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
};

// Generate mock oracle transactions
export const generateOracleTransactions = (count: number, basePrice: number): OracleTransaction[] => {
  const transactions: OracleTransaction[] = [];
  let price = basePrice;
  
  for (let i = 0; i < count; i++) {
    const oldPrice = price;
    // Add some randomness to price (up to 2% change)
    const priceChange = (Math.random() * 4 - 2) * oldPrice / 100;
    price = parseFloat((oldPrice + priceChange).toFixed(2));
    
    const hoursAgo = count - i;
    const timestamp = new Date(Date.now() - hoursAgo * 3600000).toISOString();
    
    transactions.push({
      txHash: generateTxHash(),
      timestamp,
      newPrice: price,
      oldPrice,
      blockNumber: 16000000 + Math.floor(Math.random() * 1000000),
      gasUsed: Math.floor(Math.random() * 100000) + 50000,
    });
  }
  
  // Sort transactions by timestamp (newest first)
  return transactions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Generate mock oracle data
export const generateMockOracleData = (): OracleData[] => {
  return mockCommodities.map(commodity => {
    const transactions = generateOracleTransactions(8, commodity.price);
    const lastUpdated = transactions[0].timestamp;
    
    // Next update is 6 hours after last update
    const nextUpdateTime = new Date(new Date(lastUpdated).getTime() + 6 * 3600000).toISOString();
    
    return {
      id: `oracle-${commodity.id}`,
      commodityId: commodity.id,
      latestPrice: transactions[0].newPrice,
      lastUpdated,
      nextUpdateTime,
      status: OracleStatus.Active,
      network: Math.random() > 0.5 ? "Ethereum" : "Polygon",
      address: generateAddress(),
      transactions,
    };
  });
};

// Generate mock price history data
export const generatePriceHistory = (): PriceHistory[] => {
  return mockCommodities.map(commodity => {
    const dataPoints = 24; // 24 hours of data
    const timestamps: string[] = [];
    const prices: number[] = [];
    let currentPrice = commodity.price;
    
    for (let i = 0; i < dataPoints; i++) {
      const hoursAgo = dataPoints - i;
      timestamps.push(new Date(Date.now() - hoursAgo * 3600000).toISOString());
      
      // Add some randomness to historical prices
      const volatility = 0.03; // 3% max change between points
      const change = (Math.random() * 2 * volatility - volatility) * currentPrice;
      currentPrice = parseFloat((currentPrice + change).toFixed(2));
      prices.push(currentPrice);
    }
    
    return {
      id: `history-${commodity.id}`,
      commodityId: commodity.id,
      timestamps,
      prices
    };
  });
};

// Mock oracles data
export const mockOracles = generateMockOracleData();

// Mock price history
export const mockPriceHistory = generatePriceHistory();
