import type { Address, Hash, Hex } from 'viem';

// Network types
export type NetworkType = 'mainnet' | 'testnet';

export interface GiwaNetwork {
  id: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Wallet types
export interface GiwaWallet {
  address: Address;
  publicKey: Hex;
}

export interface WalletCreationResult {
  wallet: GiwaWallet;
  mnemonic: string;
}

// Transaction types
export interface TransactionRequest {
  to: Address;
  value?: bigint;
  data?: Hex;
  gasLimit?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

export interface TransactionResult {
  hash: Hash;
  wait: () => Promise<TransactionReceipt>;
}

export interface TransactionReceipt {
  hash: Hash;
  blockNumber: bigint;
  status: 'success' | 'reverted';
  gasUsed: bigint;
}

// Token types
export interface Token {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  logoUri?: string;
}

export interface TokenBalance {
  token: Token;
  balance: bigint;
  formattedBalance: string;
}

// Bridge types
export type BridgeDirection = 'deposit' | 'withdraw';

export interface BridgeTransaction {
  direction: BridgeDirection;
  amount: bigint;
  token?: Address;
  l1TxHash?: Hash;
  l2TxHash?: Hash;
  status: 'pending' | 'confirmed' | 'finalized';
}

// Flashblocks types
export interface FlashblocksPreconfirmation {
  txHash: Hash;
  preconfirmedAt: number;
  confirmedAt?: number;
}

// GIWA ID types
export interface GiwaId {
  name: string;
  address: Address;
  avatar?: string;
  records?: Record<string, string>;
}

// Dojang types
export type AttestationType =
  | 'verified_address'
  | 'balance_root'
  | 'verified_balance'
  | 'verified_code';

export interface Attestation {
  uid: Hex;
  schema: Hex;
  attester: Address;
  recipient: Address;
  attestationType: AttestationType;
  data: Hex;
  time: bigint;
  expirationTime: bigint;
  revocable: boolean;
  revoked: boolean;
}

// Provider config
export interface GiwaConfig {
  network?: NetworkType;
  customRpcUrl?: string;
  autoConnect?: boolean;
  enableFlashblocks?: boolean;
}

// Secure storage types
export interface SecureStorageOptions {
  requireBiometric?: boolean;
  accessibleWhenUnlocked?: boolean;
}

// Biometric types
export type BiometricType = 'fingerprint' | 'face' | 'iris' | 'none';

export interface BiometricCapability {
  isAvailable: boolean;
  biometricType: BiometricType;
  isEnrolled: boolean;
}

// Error types
export interface GiwaErrorDetails {
  code: string;
  message: string;
  cause?: Error;
}
