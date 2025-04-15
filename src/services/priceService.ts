
import { CommodityCategory, CommodityPrice, OracleData, OracleStatus, PriceHistory } from "@/types";
import { mockCommodities, mockOracles, mockPriceHistory } from "@/utils/mockData";
import { toast } from "@/components/ui/use-toast";

// Simulate API call delays
const simulateAPIDelay = () => new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

/**
 * Service to fetch and manage price data
 */
class PriceService {
  private commodities: CommodityPrice[] = [...mockCommodities];
  private oracles: OracleData[] = [...mockOracles];
  private priceHistory: PriceHistory[] = [...mockPriceHistory];
  private updateInterval: NodeJS.Timeout | null = null;
  private lastScraped: Date = new Date();

  constructor() {
    // Initialize with mock data
  }

  /**
   * Fetch all commodity prices
   */
  async fetchCommodityPrices(): Promise<CommodityPrice[]> {
    await simulateAPIDelay();
    return [...this.commodities];
  }

  /**
   * Fetch commodity prices by category
   */
  async fetchCommodityPricesByCategory(category: CommodityCategory): Promise<CommodityPrice[]> {
    await simulateAPIDelay();
    return this.commodities.filter(commodity => commodity.category === category);
  }

  /**
   * Fetch a single commodity by ID
   */
  async fetchCommodity(id: string): Promise<CommodityPrice | undefined> {
    await simulateAPIDelay();
    return this.commodities.find(commodity => commodity.id === id);
  }

  /**
   * Fetch all oracle data
   */
  async fetchOracleData(): Promise<OracleData[]> {
    await simulateAPIDelay();
    return [...this.oracles];
  }

  /**
   * Fetch oracle data for a specific commodity
   */
  async fetchOracleForCommodity(commodityId: string): Promise<OracleData | undefined> {
    await simulateAPIDelay();
    return this.oracles.find(oracle => oracle.commodityId === commodityId);
  }

  /**
   * Fetch price history for a commodity
   */
  async fetchPriceHistory(commodityId: string): Promise<PriceHistory | undefined> {
    await simulateAPIDelay();
    return this.priceHistory.find(history => history.commodityId === commodityId);
  }

  /**
   * Simulate scraping prices from Trading Economics
   * This would be an actual API call in a real implementation
   */
  async scrapePrices(): Promise<void> {
    // In a real app, this would call a backend API that handles scraping
    await simulateAPIDelay();
    
    // Update last scraped time
    this.lastScraped = new Date();
    
    // Simulate price changes
    this.commodities = this.commodities.map(commodity => {
      // Generate random price change (-2% to +2%)
      const changePercent = (Math.random() * 4) - 2;
      const change = (commodity.price * changePercent) / 100;
      const newPrice = parseFloat((commodity.price + change).toFixed(2));
      
      return {
        ...commodity,
        price: newPrice,
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        lastUpdate: new Date().toISOString()
      };
    });
    
    toast({
      title: "Prices Updated",
      description: `Successfully scraped latest commodity prices from Trading Economics at ${new Date().toLocaleTimeString()}`,
    });
  }

  /**
   * Update blockchain oracles with latest price data
   */
  async updateOracles(): Promise<void> {
    // In a real app, this would submit transactions to blockchain networks
    await simulateAPIDelay();
    
    // Update oracle data with the latest prices
    this.oracles = this.oracles.map(oracle => {
      const commodity = this.commodities.find(c => c.id === oracle.commodityId);
      
      if (!commodity) return oracle;
      
      const now = new Date();
      const lastUpdated = now.toISOString();
      const nextUpdateTime = new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(); // 6 hours later
      
      // Add a new transaction to oracle history
      const newTransaction = {
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`, // Mock transaction hash
        timestamp: lastUpdated,
        newPrice: commodity.price,
        oldPrice: oracle.latestPrice,
        blockNumber: oracle.transactions[0]?.blockNumber + Math.floor(Math.random() * 100) + 1 || 16000000,
        gasUsed: Math.floor(Math.random() * 100000) + 50000,
      };
      
      return {
        ...oracle,
        latestPrice: commodity.price,
        lastUpdated,
        nextUpdateTime,
        status: OracleStatus.Active,
        transactions: [newTransaction, ...oracle.transactions].slice(0, 10) // Keep only the 10 most recent transactions
      };
    });
    
    // Update price history with new data points
    this.updatePriceHistory();
    
    toast({
      title: "Oracles Updated",
      description: `Successfully updated ${this.oracles.length} blockchain oracles with latest price data`,
      variant: "default",
    });
  }

  /**
   * Update price history with latest data
   */
  private updatePriceHistory(): void {
    this.priceHistory = this.priceHistory.map(history => {
      const commodity = this.commodities.find(c => c.id === history.commodityId);
      if (!commodity) return history;
      
      const now = new Date().toISOString();
      
      return {
        ...history,
        timestamps: [...history.timestamps, now].slice(-24), // Keep 24 data points
        prices: [...history.prices, commodity.price].slice(-24) // Keep 24 data points
      };
    });
  }

  /**
   * Get the last scraped time
   */
  getLastScrapedTime(): Date {
    return this.lastScraped;
  }

  /**
   * Start automatic updates (every 6 hours)
   */
  startAutomaticUpdates(callback: () => void): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // For demo purposes, we'll run this every minute instead of 6 hours
    // In a real app, this would be 6 * 60 * 60 * 1000 (6 hours)
    this.updateInterval = setInterval(async () => {
      await this.scrapePrices();
      await this.updateOracles();
      callback();
    }, 60000);
    
    toast({
      title: "Automatic Updates Enabled",
      description: "Oracle prices will update automatically every minute (simulating 6 hours)",
    });
  }

  /**
   * Stop automatic updates
   */
  stopAutomaticUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      
      toast({
        title: "Automatic Updates Disabled",
        description: "Oracle price updates have been paused",
      });
    }
  }
}

// Create a singleton instance
export const priceService = new PriceService();
