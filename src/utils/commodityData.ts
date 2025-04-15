
import { CommodityCategory, CommodityPrice } from "@/types";

// Function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Function to generate a random price change percentage between -3% and +3%
const generateRandomChange = (basePrice: number): { change: number, changePercent: number } => {
  const changePercent = (Math.random() * 6) - 3; // Between -3% and +3%
  const change = (basePrice * changePercent) / 100;
  return {
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2))
  };
};

// Helper function to create a commodity price object
const createCommodity = (
  name: string,
  price: number,
  unit: string,
  category: CommodityCategory
): CommodityPrice => {
  const { change, changePercent } = generateRandomChange(price);
  
  return {
    id: generateId(),
    name,
    price,
    unit,
    change,
    changePercent,
    lastUpdate: new Date().toISOString(),
    category,
  };
};

// Comprehensive list of commodities from Trading Economics
export const generateCommodities = (): CommodityPrice[] => {
  return [
    // Energy Commodities
    createCommodity("Crude Oil", 82.79, "USD/Bbl", CommodityCategory.Energy),
    createCommodity("Brent Oil", 84.91, "USD/Bbl", CommodityCategory.Energy),
    createCommodity("Natural Gas", 2.10, "USD/MMBtu", CommodityCategory.Energy),
    createCommodity("Heating Oil", 2.64, "USD/Gal", CommodityCategory.Energy),
    createCommodity("Gasoline", 2.43, "USD/Gal", CommodityCategory.Energy),
    createCommodity("London Gas Oil", 735.38, "USD/MT", CommodityCategory.Energy),
    createCommodity("Coal", 148.75, "USD/T", CommodityCategory.Energy),
    createCommodity("Ethanol", 1.35, "USD/Gal", CommodityCategory.Energy),
    createCommodity("Carbon", 67.24, "EUR/MT", CommodityCategory.Energy),
    createCommodity("UK Natural Gas", 88.52, "GBp/Thm", CommodityCategory.Energy),
    createCommodity("TTF Gas", 33.05, "EUR/MWh", CommodityCategory.Energy),
    
    // Metals Commodities
    createCommodity("Gold", 2381.90, "USD/t oz.", CommodityCategory.Metals),
    createCommodity("Silver", 28.14, "USD/t oz.", CommodityCategory.Metals),
    createCommodity("Platinum", 943.80, "USD/t oz.", CommodityCategory.Metals),
    createCommodity("Palladium", 1018.94, "USD/t oz.", CommodityCategory.Metals),
    createCommodity("Copper", 4.58, "USD/Lbs", CommodityCategory.Metals),
    createCommodity("Aluminum", 2394.75, "USD/T", CommodityCategory.Metals),
    createCommodity("Zinc", 2756.50, "USD/T", CommodityCategory.Metals),
    createCommodity("Nickel", 19046.00, "USD/T", CommodityCategory.Metals),
    createCommodity("Lead", 2155.25, "USD/T", CommodityCategory.Metals),
    createCommodity("Iron Ore", 119.00, "USD/T", CommodityCategory.Metals),
    createCommodity("Steel", 3984.00, "CNY/T", CommodityCategory.Metals),
    createCommodity("Tin", 30212.00, "USD/T", CommodityCategory.Metals),
    createCommodity("Lithium", 139000.00, "CNY/T", CommodityCategory.Metals),
    createCommodity("Uranium", 90.25, "USD/Lbs", CommodityCategory.Metals),
    createCommodity("Cobalt", 34200.00, "USD/T", CommodityCategory.Metals),
    createCommodity("Molybdenum", 27.38, "USD/Lbs", CommodityCategory.Metals),
    
    // Agriculture Commodities
    createCommodity("Wheat", 604.00, "USd/Bu", CommodityCategory.Agriculture),
    createCommodity("Corn", 457.75, "USd/Bu", CommodityCategory.Agriculture),
    createCommodity("Soybeans", 1203.50, "USd/Bu", CommodityCategory.Agriculture),
    createCommodity("Rice", 17.01, "USD/cwt", CommodityCategory.Agriculture),
    createCommodity("Oats", 381.00, "USd/Bu", CommodityCategory.Agriculture),
    createCommodity("Soybean Oil", 49.71, "USd/Lbs", CommodityCategory.Agriculture),
    createCommodity("Soybean Meal", 353.90, "USD/T", CommodityCategory.Agriculture),
    createCommodity("Palm Oil", 3814.00, "MYR/T", CommodityCategory.Agriculture),
    createCommodity("Canola", 714.80, "CAD/T", CommodityCategory.Agriculture),
    createCommodity("London Wheat", 203.10, "GBP/MT", CommodityCategory.Agriculture),
    createCommodity("Rapeseed", 502.75, "EUR/T", CommodityCategory.Agriculture),
    createCommodity("Rough Rice", 16.12, "USD/cwt", CommodityCategory.Agriculture),
    createCommodity("Feed Wheat", 225.00, "GBP/T", CommodityCategory.Agriculture),
    createCommodity("Hard Red Wheat", 694.25, "USd/Bu", CommodityCategory.Agriculture),
    
    // Livestock Commodities
    createCommodity("Live Cattle", 187.38, "USd/Lbs", CommodityCategory.Livestock),
    createCommodity("Feeder Cattle", 257.72, "USd/Lbs", CommodityCategory.Livestock),
    createCommodity("Lean Hogs", 94.85, "USd/Lbs", CommodityCategory.Livestock),
    createCommodity("Class III Milk", 19.95, "USD/cwt", CommodityCategory.Livestock),
    createCommodity("Live Hogs", 19883.00, "CNY/T", CommodityCategory.Livestock),
    createCommodity("Live Pork Bellies", 162.95, "USd/Lbs", CommodityCategory.Livestock),
    
    // Softs Commodities
    createCommodity("Coffee", 2.24, "USD/Lbs", CommodityCategory.Softs),
    createCommodity("Cocoa", 10084.00, "USD/T", CommodityCategory.Softs),
    createCommodity("Sugar", 19.99, "USd/Lbs", CommodityCategory.Softs),
    createCommodity("Orange Juice", 408.50, "USd/Lbs", CommodityCategory.Softs),
    createCommodity("Cotton", 80.10, "USd/Lbs", CommodityCategory.Softs),
    createCommodity("Lumber", 565.00, "USD/1000 bd ft", CommodityCategory.Softs),
    createCommodity("Rubber", 1.79, "USD/Kg", CommodityCategory.Softs),
    createCommodity("London Robusta Coffee", 3883.00, "USD/T", CommodityCategory.Softs),
    createCommodity("London Sugar", 481.00, "USD/T", CommodityCategory.Softs),
    createCommodity("London Cocoa", 6503.00, "GBP/T", CommodityCategory.Softs),
    
    // Indices Commodities
    createCommodity("Commodity Index", 326.44, "Index Points", CommodityCategory.Indices),
    createCommodity("Gold Miners ETF", 33.24, "USD", CommodityCategory.Indices),
    createCommodity("USD Index", 104.00, "Index Points", CommodityCategory.Indices),
    createCommodity("S&P GSCI", 631.32, "Index Points", CommodityCategory.Indices),
    createCommodity("Rogers Intl", 2786.91, "Index Points", CommodityCategory.Indices),
    createCommodity("DJ Commodity", 454.81, "Index Points", CommodityCategory.Indices),
    createCommodity("MSCI World Commodity Producers", 392.93, "Index Points", CommodityCategory.Indices)
  ];
};
