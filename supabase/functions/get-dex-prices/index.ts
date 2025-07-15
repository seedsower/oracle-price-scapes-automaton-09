import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DEXPriceRequest {
  tokenAddress: string;
  blockchain: 'base' | 'solana';
  vs_currency?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'GET') {
      // Get all DEX prices
      const { data: tradingPairs, error } = await supabase
        .from('dex_trading_pairs')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      // Mock price data - in production, this would fetch from actual DEX APIs
      const pricesWithDexData = tradingPairs.map(pair => ({
        ...pair,
        dex_price_usd: Math.random() * 1000 + 50, // Mock price
        price_change_24h: (Math.random() * 10) - 5, // -5% to +5%
        last_updated: new Date().toISOString(),
        aerodrome_tvl: pair.blockchain === 'base' ? Math.random() * 10000000 : null,
        jupiter_volume_24h: pair.blockchain === 'solana' ? Math.random() * 1000000 : null
      }));

      return new Response(
        JSON.stringify({ prices: pricesWithDexData }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (req.method === 'POST') {
      const { tokenAddress, blockchain, vs_currency = 'usd' }: DEXPriceRequest = await req.json();

      if (!tokenAddress || !blockchain) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters: tokenAddress, blockchain' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }

      let price = 0;
      let source = '';

      if (blockchain === 'base') {
        // Mock Aerodrome price fetch
        try {
          // In production, this would call Aerodrome's API or on-chain data
          price = Math.random() * 1000 + 50;
          source = 'aerodrome';
        } catch (error) {
          console.error('Error fetching Aerodrome price:', error);
        }
      } else if (blockchain === 'solana') {
        // Mock Jupiter price fetch
        try {
          // In production, this would call Jupiter's API
          const jupiterResponse = {
            price: Math.random() * 1000 + 50,
            source: 'jupiter'
          };
          price = jupiterResponse.price;
          source = jupiterResponse.source;
        } catch (error) {
          console.error('Error fetching Jupiter price:', error);
        }
      }

      // Store price in database
      const { error: insertError } = await supabase
        .from('commodity_tokens')
        .update({ 
          liquidity_usd: price * 1000, // Mock liquidity
          daily_volume_usd: price * 100, // Mock volume
          updated_at: new Date().toISOString()
        })
        .eq('contract_address', tokenAddress);

      if (insertError) {
        console.error('Error updating token data:', insertError);
      }

      return new Response(
        JSON.stringify({
          tokenAddress,
          blockchain,
          price,
          vs_currency,
          source,
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405 
      }
    );

  } catch (error) {
    console.error('Error in get-dex-prices function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});