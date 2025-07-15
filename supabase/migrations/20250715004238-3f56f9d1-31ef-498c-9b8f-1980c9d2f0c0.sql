-- Add DEX-related columns to commodity_tokens table
ALTER TABLE public.commodity_tokens 
ADD COLUMN IF NOT EXISTS aerodrome_pool_address text,
ADD COLUMN IF NOT EXISTS jupiter_mint_address text,
ADD COLUMN IF NOT EXISTS liquidity_usd numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_volume_usd numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Update all existing tokens with proper standardized tickers and add missing tokens
UPDATE public.commodity_tokens SET ticker = 'GC' WHERE symbol = 'GOLD';
UPDATE public.commodity_tokens SET ticker = 'SI' WHERE symbol = 'SILVER';
UPDATE public.commodity_tokens SET ticker = 'CL' WHERE symbol = 'OIL';
UPDATE public.commodity_tokens SET ticker = 'NG' WHERE symbol = 'NATGAS';
UPDATE public.commodity_tokens SET ticker = 'HG' WHERE symbol = 'COPPER';
UPDATE public.commodity_tokens SET ticker = 'ZW' WHERE symbol = 'WHEAT';
UPDATE public.commodity_tokens SET ticker = 'ZC' WHERE symbol = 'CORN';
UPDATE public.commodity_tokens SET ticker = 'ZS' WHERE symbol = 'SOYBEANS';
UPDATE public.commodity_tokens SET ticker = 'KC' WHERE symbol = 'COFFEE';
UPDATE public.commodity_tokens SET ticker = 'CC' WHERE symbol = 'COCOA';
UPDATE public.commodity_tokens SET ticker = 'CT' WHERE symbol = 'COTTON';
UPDATE public.commodity_tokens SET ticker = 'SB' WHERE symbol = 'SUGAR';
UPDATE public.commodity_tokens SET ticker = 'PL' WHERE symbol = 'PLATINUM';
UPDATE public.commodity_tokens SET ticker = 'PA' WHERE symbol = 'PALLADIUM';
UPDATE public.commodity_tokens SET ticker = 'HO' WHERE symbol = 'HEATING_OIL';
UPDATE public.commodity_tokens SET ticker = 'RB' WHERE symbol = 'GASOLINE';
UPDATE public.commodity_tokens SET ticker = 'LE' WHERE symbol = 'LIVE_CATTLE';
UPDATE public.commodity_tokens SET ticker = 'GF' WHERE symbol = 'FEEDER_CATTLE';
UPDATE public.commodity_tokens SET ticker = 'HE' WHERE symbol = 'LEAN_HOGS';
UPDATE public.commodity_tokens SET ticker = 'LBS' WHERE symbol = 'LUMBER';
UPDATE public.commodity_tokens SET ticker = 'ZR' WHERE symbol = 'RICE';
UPDATE public.commodity_tokens SET ticker = 'ZO' WHERE symbol = 'OATS';

-- Insert missing energy commodities
INSERT INTO public.commodity_tokens (symbol, name, ticker, blockchain, contract_address) VALUES
('BRENT', 'Brent Oil Token', 'BZ', 'base', '0x' || encode(gen_random_bytes(20), 'hex')),
('BRENT_SOL', 'Brent Oil Token', 'BZ', 'solana', encode(gen_random_bytes(32), 'base58'));

-- Insert missing metals
INSERT INTO public.commodity_tokens (symbol, name, ticker, blockchain, contract_address) VALUES
('ALUMINUM', 'Aluminum Token', 'ALI', 'base', '0x' || encode(gen_random_bytes(20), 'hex')) ON CONFLICT DO NOTHING,
('ALUMINUM_SOL', 'Aluminum Token', 'ALI', 'solana', encode(gen_random_bytes(32), 'base58')) ON CONFLICT DO NOTHING;

-- Add mock liquidity and volume data for existing tokens
UPDATE public.commodity_tokens SET 
  liquidity_usd = CASE 
    WHEN symbol LIKE '%GOLD%' THEN 50000000 + random() * 20000000
    WHEN symbol LIKE '%SILVER%' THEN 25000000 + random() * 10000000
    WHEN symbol LIKE '%OIL%' THEN 75000000 + random() * 30000000
    WHEN symbol LIKE '%COPPER%' THEN 15000000 + random() * 8000000
    WHEN symbol LIKE '%WHEAT%' THEN 8000000 + random() * 5000000
    ELSE 5000000 + random() * 3000000
  END,
  daily_volume_usd = CASE 
    WHEN symbol LIKE '%GOLD%' THEN 10000000 + random() * 5000000
    WHEN symbol LIKE '%SILVER%' THEN 5000000 + random() * 2000000
    WHEN symbol LIKE '%OIL%' THEN 15000000 + random() * 8000000
    WHEN symbol LIKE '%COPPER%' THEN 3000000 + random() * 1500000
    WHEN symbol LIKE '%WHEAT%' THEN 2000000 + random() * 1000000
    ELSE 1000000 + random() * 500000
  END;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_commodity_tokens_blockchain ON public.commodity_tokens(blockchain);
CREATE INDEX IF NOT EXISTS idx_commodity_tokens_ticker ON public.commodity_tokens(ticker);
CREATE INDEX IF NOT EXISTS idx_commodity_tokens_active ON public.commodity_tokens(is_active);

-- Create a view for DEX trading pairs
CREATE OR REPLACE VIEW public.dex_trading_pairs AS
SELECT 
  c1.id as base_token_id,
  c1.symbol as base_symbol,
  c1.name as base_name,
  c1.ticker,
  c1.blockchain,
  c1.contract_address,
  c1.aerodrome_pool_address,
  c1.jupiter_mint_address,
  c1.liquidity_usd,
  c1.daily_volume_usd,
  c1.is_active,
  c2.id as pair_token_id,
  c2.symbol as pair_symbol,
  c2.blockchain as pair_blockchain,
  c2.contract_address as pair_contract_address
FROM public.commodity_tokens c1
LEFT JOIN public.commodity_tokens c2 ON 
  c1.ticker = c2.ticker AND 
  c1.blockchain != c2.blockchain AND
  c1.is_active = true AND 
  c2.is_active = true
WHERE c1.is_active = true
ORDER BY c1.liquidity_usd DESC;