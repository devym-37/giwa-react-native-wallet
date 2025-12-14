export class GiwaError extends Error {
  public readonly code: string;
  public readonly cause?: Error;

  constructor(message: string, code: string, cause?: Error) {
    super(message);
    this.name = 'GiwaError';
    this.code = code;
    this.cause = cause;
    Object.setPrototypeOf(this, GiwaError.prototype);
  }
}

export class GiwaSecurityError extends GiwaError {
  constructor(message: string, cause?: Error) {
    super(message, 'SECURITY_ERROR', cause);
    this.name = 'GiwaSecurityError';
    Object.setPrototypeOf(this, GiwaSecurityError.prototype);
  }
}

export class GiwaNetworkError extends GiwaError {
  constructor(message: string, cause?: Error) {
    super(message, 'NETWORK_ERROR', cause);
    this.name = 'GiwaNetworkError';
    Object.setPrototypeOf(this, GiwaNetworkError.prototype);
  }
}

export class GiwaWalletError extends GiwaError {
  constructor(message: string, cause?: Error) {
    super(message, 'WALLET_ERROR', cause);
    this.name = 'GiwaWalletError';
    Object.setPrototypeOf(this, GiwaWalletError.prototype);
  }
}

export class GiwaTransactionError extends GiwaError {
  constructor(message: string, cause?: Error) {
    super(message, 'TRANSACTION_ERROR', cause);
    this.name = 'GiwaTransactionError';
    Object.setPrototypeOf(this, GiwaTransactionError.prototype);
  }
}

// Error codes
export const ErrorCodes = {
  // Security
  SECURE_STORAGE_UNAVAILABLE: 'SECURE_STORAGE_UNAVAILABLE',
  BIOMETRIC_NOT_AVAILABLE: 'BIOMETRIC_NOT_AVAILABLE',
  BIOMETRIC_NOT_ENROLLED: 'BIOMETRIC_NOT_ENROLLED',
  BIOMETRIC_FAILED: 'BIOMETRIC_FAILED',

  // Wallet
  WALLET_NOT_FOUND: 'WALLET_NOT_FOUND',
  WALLET_ALREADY_EXISTS: 'WALLET_ALREADY_EXISTS',
  INVALID_MNEMONIC: 'INVALID_MNEMONIC',
  INVALID_PRIVATE_KEY: 'INVALID_PRIVATE_KEY',

  // Transaction
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  GAS_ESTIMATION_FAILED: 'GAS_ESTIMATION_FAILED',

  // Network
  RPC_ERROR: 'RPC_ERROR',
  NETWORK_UNAVAILABLE: 'NETWORK_UNAVAILABLE',

  // Bridge
  BRIDGE_DEPOSIT_FAILED: 'BRIDGE_DEPOSIT_FAILED',
  BRIDGE_WITHDRAW_FAILED: 'BRIDGE_WITHDRAW_FAILED',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
