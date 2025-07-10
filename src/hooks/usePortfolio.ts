import { useState, useEffect } from 'react';
import { Portfolio, TokenPosition, CommodityPrice } from '@/types';
import { portfolioService } from '@/services/portfolioService';

export const usePortfolio = (commodities: CommodityPrice[] = []) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [positions, setPositions] = useState<TokenPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedPositions = await portfolioService.getPositions();
      
      // Update positions with current commodity prices
      const updatedPositions = portfolioService.updatePositionsWithPrices(fetchedPositions, commodities);
      setPositions(updatedPositions);
      
      // Calculate portfolio summary
      const portfolioSummary = await portfolioService.calculatePortfolio(updatedPositions);
      setPortfolio(portfolioSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  const addPosition = async (commodityId: string, amount: number, network: 'base' | 'solana') => {
    try {
      await portfolioService.addPosition(commodityId, amount, network);
      // Refresh positions after adding
      await fetchPositions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add position');
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [commodities]);

  return {
    portfolio,
    positions,
    isLoading,
    error,
    refreshPortfolio: fetchPositions,
    addPosition
  };
};