-- Add more commodity tokens including Solana blockchain tokens
INSERT INTO public.commodity_tokens (symbol, name, ticker, contract_address, blockchain) VALUES
  -- Additional Base commodities
  ('COCOA', 'Cocoa Token', 'CCO', '0x1234567890123456789012345678901234567890', 'base'),
  ('COFFEE', 'Coffee Token', 'CFE', '0x2345678901234567890123456789012345678901', 'base'),
  ('ETHANOL', 'Ethanol Token', 'ETH', '0x3456789012345678901234567890123456789012', 'base'),
  ('IRON_ORE', 'Iron Ore Token', 'IRN', '0x4567890123456789012345678901234567890123', 'base'),
  ('TIN', 'Tin Token', 'TIN', '0x5678901234567890123456789012345678901234', 'base'),
  ('LEAD', 'Lead Token', 'LED', '0x6789012345678901234567890123456789012345', 'base'),
  ('COBALT', 'Cobalt Token', 'CBT', '0x7890123456789012345678901234567890123456', 'base'),
  ('MOLYBDENUM', 'Molybdenum Token', 'MBD', '0x8901234567890123456789012345678901234567', 'base'),
  ('RHODIUM', 'Rhodium Token', 'RHD', '0x9012345678901234567890123456789012345678', 'base'),
  ('IRIDIUM', 'Iridium Token', 'IRD', '0xa123456789012345678901234567890123456789', 'base'),
  
  -- Solana blockchain tokens
  ('GOLD_SOL', 'Gold Token', 'GLD', 'Au1JvNdpEQVBfYnHqrHaJKEMqZNVaQRXxFYQ9w8YV2F2', 'solana'),
  ('SILVER_SOL', 'Silver Token', 'SLV', 'Ag2KpYmKvDqHqP1VBfYnHqrHaJKEMqZNVaQRXxFYQ9w8', 'solana'),
  ('COPPER_SOL', 'Copper Token', 'CPR', 'Cu3LqZmLwEsGsQ2WCgZoIzYoK4R5TpMnBhDfVx7N9k5e', 'solana'),
  ('OIL_SOL', 'Crude Oil Token', 'OIL', 'Cr4MsNrFhHpJqR6XDhZpKzYpL5SpQoNmChEgWy8Q1j7f', 'solana'),
  ('WHEAT_SOL', 'Wheat Token', 'WHT', 'Wh5NtPgIiKqSr7YEiApMlAzQm6TqRpOoNiDhGz9R2k8g', 'solana'),
  ('CORN_SOL', 'Corn Token', 'CRN', 'Co6OuQhJjLrTs8ZFjBqNmBaRn7UsSpQqPjEhHa0S3l9h', 'solana'),
  ('SOYBEANS_SOL', 'Soybeans Token', 'SOY', 'So7PvRiKkMsUt9AGkCrOoCcSo8VtTqRrQkFiIb1T4m0i', 'solana'),
  ('NATGAS_SOL', 'Natural Gas Token', 'GAS', 'Na8QwSjLlNtVu0BHlDsPoDbTp9WuUsSsRlGjJc2U5n1j', 'solana'),
  ('PLATINUM_SOL', 'Platinum Token', 'PLT', 'Pt9RxTkMmOvWv1CImEtQqEeUq0XvVtTtSmHkKd3V6o2k', 'solana'),
  ('COFFEE_SOL', 'Coffee Token', 'CFE', 'Cf0SyUlNnPwXw2DJmFuRrFfVr1YwWuUuToIlLe4W7p3l', 'solana'),
  ('SUGAR_SOL', 'Sugar Token', 'SGR', 'Su1TzVmOoPxYy3EKnGvSsFgWs2ZxXvVvUpJmMf5X8q4m', 'solana'),
  ('COTTON_SOL', 'Cotton Token', 'CTN', 'Co2UaWnPpQyZz4FLoHwTtGhXt3AyYwWwVqKnNg6Y9r5n', 'solana'),
  ('ALUMINUM_SOL', 'Aluminum Token', 'ALU', 'Al3VbXoPqRzAa5GMpIxUuHiYu4BzZxXxWrLoOh7Z0s6o', 'solana'),
  ('ZINC_SOL', 'Zinc Token', 'ZNC', 'Zn4WcYpQsS0Bb6HNqJyVvJjZv5CaAyYyXsLpPi8A1t7p', 'solana'),
  ('NICKEL_SOL', 'Nickel Token', 'NKL', 'Ni5XdZqRtT1Cc7IOrkzWwKkAw6DbByZzYtMqQj9B2u8q', 'solana')
ON CONFLICT (symbol) DO NOTHING;