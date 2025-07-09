import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletIcon, LogOutIcon, NetworkIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { base, baseSepolia } from 'wagmi/chains';

export function WalletConnection() {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { toast } = useToast();

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

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && address) {
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
          <CardDescription>
            Connected via {connector?.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  onClick={copyAddress}
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
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

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
      <CardContent className="space-y-3">
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
        
        <div className="text-xs text-muted-foreground text-center mt-4">
          Supported networks: Base, Base Sepolia
        </div>
      </CardContent>
    </Card>
  );
}