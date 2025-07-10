import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

// Default to devnet for development
export const SOLANA_NETWORK = 'devnet';
export const SOLANA_RPC_ENDPOINT = clusterApiUrl(SOLANA_NETWORK);

export const useSolanaWallets = () => {
  return useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
  ], []);
};

export const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');