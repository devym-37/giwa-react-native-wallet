import type { GiwaNetwork, NetworkType } from '../types';

export const GIWA_NETWORKS: Record<NetworkType, GiwaNetwork> = {
  testnet: {
    id: 91342,
    name: 'GIWA Testnet',
    rpcUrl: 'https://sepolia-rpc.giwa.io/',
    explorerUrl: 'https://sepolia-explorer.giwa.io/',
    currency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  mainnet: {
    id: 91341, // TBD - placeholder
    name: 'GIWA Mainnet',
    rpcUrl: 'https://rpc.giwa.io/',
    explorerUrl: 'https://explorer.giwa.io/',
    currency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

export const DEFAULT_NETWORK: NetworkType = 'testnet';

export function getNetwork(network: NetworkType = DEFAULT_NETWORK): GiwaNetwork {
  return GIWA_NETWORKS[network];
}
