
export interface CommodityPrice {
  id: string;
  name: string;
  ticker?: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  lastUpdate: string;
  category: CommodityCategory;
  contractAddresses?: {
    base?: string;
    solana?: string;
  };
}

export enum CommodityCategory {
  Energy = "Energy",
  Metals = "Metals",
  Agriculture = "Agriculture",
  Livestock = "Livestock",
  Softs = "Softs",
  Indices = "Indices",
}

export interface OracleData {
  id: string;
  commodityId: string;
  latestPrice: number;
  lastUpdated: string;
  nextUpdateTime: string;
  status: OracleStatus;
  network: string;
  address: string;
  transactions: OracleTransaction[];
}

export enum OracleStatus {
  Active = "Active",
  Pending = "Pending",
  Failed = "Failed",
}

export interface OracleTransaction {
  txHash: string;
  timestamp: string;
  newPrice: number;
  oldPrice: number;
  blockNumber: number;
  gasUsed: number;
}

export interface PriceHistory {
  id: string;
  commodityId: string;
  timestamps: string[];
  prices: number[];
}

export interface TokenPosition {
  id: string;
  commodityId: string;
  commodityName: string;
  ticker: string;
  network: 'base' | 'solana';
  contractAddress: string;
  balance: number;
  purchasePrice: number;
  currentPrice: number;
  profitLoss: number;
  profitLossPercent: number;
  value: number;
  purchaseDate: string;
}

export interface Portfolio {
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  positions: TokenPosition[];
}
