import { TokenPosition, Portfolio, CommodityPrice } from "@/types";

// Mock portfolio data - in a real app this would come from blockchain/API
const generateMockPositions = (): TokenPosition[] => {
  return [
    {
      id: "pos-1",
      commodityId: "cocoa-1",
      commodityName: "Cocoa",
      ticker: "COA",
      network: "base",
      contractAddress: "0x7D8466C9737A21092d545BEDd5aBc702f7dE9353",
      balance: 1.5,
      purchasePrice: 9500.00,
      currentPrice: 10084.00,
      profitLoss: 876.00,
      profitLossPercent: 9.22,
      value: 15126.00,
      purchaseDate: "2024-01-15T10:30:00Z"
    },
    {
      id: "pos-2", 
      commodityId: "gold-1",
      commodityName: "Gold",
      ticker: "GLD",
      network: "base",
      contractAddress: "0x1234567890123456789012345678901234567890",
      balance: 0.5,
      purchasePrice: 2200.00,
      currentPrice: 2381.90,
      profitLoss: 90.95,
      profitLossPercent: 8.27,
      value: 1190.95,
      purchaseDate: "2024-02-01T14:20:00Z"
    },
    {
      id: "pos-3",
      commodityId: "crude-oil-1", 
      commodityName: "Crude Oil",
      ticker: "OIL",
      network: "solana",
      contractAddress: "ABC123DEF456GHI789JKL012MNO345PQR678STU901",
      balance: 5.0,
      purchasePrice: 85.00,
      currentPrice: 82.79,
      profitLoss: -11.05,
      profitLossPercent: -2.59,
      value: 413.95,
      purchaseDate: "2024-02-10T09:15:00Z"
    }
  ];
};

export const portfolioService = {
  // Get user's token positions
  getPositions: async (): Promise<TokenPosition[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockPositions();
  },

  // Calculate portfolio summary
  calculatePortfolio: async (positions: TokenPosition[]): Promise<Portfolio> => {
    const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0);
    const totalProfitLoss = positions.reduce((sum, pos) => sum + pos.profitLoss, 0);
    const totalProfitLossPercent = totalValue > 0 ? (totalProfitLoss / (totalValue - totalProfitLoss)) * 100 : 0;

    return {
      totalValue,
      totalProfitLoss,
      totalProfitLossPercent,
      positions
    };
  },

  // Update position with current commodity prices
  updatePositionsWithPrices: (positions: TokenPosition[], commodities: CommodityPrice[]): TokenPosition[] => {
    return positions.map(position => {
      const commodity = commodities.find(c => 
        c.name.toLowerCase() === position.commodityName.toLowerCase()
      );
      
      if (commodity) {
        const currentPrice = commodity.price;
        const profitLoss = (currentPrice - position.purchasePrice) * position.balance;
        const profitLossPercent = ((currentPrice - position.purchasePrice) / position.purchasePrice) * 100;
        const value = currentPrice * position.balance;

        return {
          ...position,
          currentPrice,
          profitLoss,
          profitLossPercent,
          value
        };
      }

      return position;
    });
  },

  // Add a new position (for tokenization)
  addPosition: async (commodityId: string, amount: number, network: 'base' | 'solana'): Promise<void> => {
    // In a real app, this would interact with smart contracts
    console.log(`Adding position: ${commodityId}, amount: ${amount}, network: ${network}`);
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
};