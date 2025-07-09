import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletIcon, LogOutIcon, NetworkIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { base, baseSepolia } from 'wagmi/chains';
import { useState } from 'react';

export function WalletConnection() {
  // Ethereum/Base wallet state
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  
  // Solana wallet state
  const { publicKey, connected: solanaConnected, disconnect: solanaDisconnect } = useWallet();
  const { connection } = useConnection();
  
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'ethereum' | 'solana'>('ethereum');

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case base.id:
        return "Base";
      case baseSepolia.id:
        return "Base Sepolia";
      default:
        return "Unknown Network";
    }
  };

  const copyAddress = async (addressToCopy: string) => {
    if (addressToCopy) {
      await navigator.clipboard.writeText(addressToCopy);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Connected state for either chain
  if ((isConnected && address) || (solanaConnected && publicKey)) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WalletIcon className="h-5 w-5" />
              <CardTitle className="text-lg">Wallet Connected</CardTitle>
            </div>
            <Badge variant="default" className="bg-success text-success-foreground">
              Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'ethereum' | 'solana')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
              <TabsTrigger value="solana">Solana</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ethereum" className="space-y-3 mt-4">
              {isConnected && address ? (
                <>
                  <CardDescription>Connected via {connector?.name}</CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Address:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {formatAddress(address)}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyAddress(address)}
                        >
                          <CopyIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Network:</span>
                      <div className="flex items-center gap-2">
                        <NetworkIcon className="h-4 w-4" />
                        <span className="text-sm">{getNetworkName(chainId)}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => disconnect()}
                  >
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    Disconnect Ethereum
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">No Ethereum wallet connected</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="solana" className="space-y-3 mt-4">
              {solanaConnected && publicKey ? (
                <>
                  <CardDescription>Connected to Solana Network</CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Address:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {formatAddress(publicKey.toBase58())}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyAddress(publicKey.toBase58())}
                        >
                          <CopyIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Network:</span>
                      <div className="flex items-center gap-2">
                        <NetworkIcon className="h-4 w-4" />
                        <span className="text-sm">Solana Devnet</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => solanaDisconnect()}
                  >
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    Disconnect Solana
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">No Solana wallet connected</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  // Disconnected state
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <WalletIcon className="h-5 w-5" />
          <CardTitle className="text-lg">Connect Wallet</CardTitle>
        </div>
        <CardDescription>
          Connect your wallet to start tokenizing commodities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'ethereum' | 'solana')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
            <TabsTrigger value="solana">Solana</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ethereum" className="space-y-3 mt-4">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => connect({ connector })}
                disabled={isPending}
              >
                <WalletIcon className="h-4 w-4" />
                {connector.name === 'WalletConnect' ? 'WalletConnect' : connector.name}
                {isPending && <span className="ml-auto text-xs">Connecting...</span>}
              </Button>
            ))}
            <div className="text-xs text-muted-foreground text-center">
              Supported networks: Base, Base Sepolia
            </div>
          </TabsContent>
          
          <TabsContent value="solana" className="space-y-3 mt-4">
            <div className="w-full">
              <WalletMultiButton className="!w-full !justify-center !bg-background !text-foreground !border !border-input hover:!bg-accent hover:!text-accent-foreground" />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Supported wallets: Phantom, Solflare, Torus, Ledger
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}