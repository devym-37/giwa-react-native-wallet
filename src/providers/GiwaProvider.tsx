import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import { GiwaClient } from '../core/GiwaClient';
import { WalletManager } from '../core/WalletManager';
import { TokenManager } from '../core/TokenManager';
import { BridgeManager } from '../core/BridgeManager';
import { FlashblocksManager } from '../core/FlashblocksManager';
import { GiwaIdManager } from '../core/GiwaIdManager';
import { DojangManager } from '../core/DojangManager';
import { AdapterFactory, type Adapters } from '../adapters/AdapterFactory';
import type { GiwaConfig, GiwaWallet, NetworkType } from '../types';
import type { Environment } from '../utils/secureStorageValidator';

// Context state interface
interface GiwaContextState {
  // Core instances
  client: GiwaClient;
  walletManager: WalletManager;
  tokenManager: TokenManager;
  bridgeManager: BridgeManager;
  flashblocksManager: FlashblocksManager;
  giwaIdManager: GiwaIdManager;
  dojangManager: DojangManager;

  // Adapters
  adapters: Adapters | null;

  // State
  wallet: GiwaWallet | null;
  setWallet: (wallet: GiwaWallet | null) => void;
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  environment: Environment | null;
  network: NetworkType;
}

// Create context with undefined default
const GiwaContext = createContext<GiwaContextState | undefined>(undefined);

// Provider props
export interface GiwaProviderProps {
  children: ReactNode;
  config?: GiwaConfig;
  forceEnvironment?: Environment;
}

/**
 * GIWA Provider - wraps application with GIWA SDK context
 *
 * Usage:
 * ```tsx
 * <GiwaProvider config={{ network: 'testnet' }}>
 *   <App />
 * </GiwaProvider>
 * ```
 */
export function GiwaProvider({
  children,
  config = {},
  forceEnvironment,
}: GiwaProviderProps): JSX.Element {
  // State
  const [wallet, setWallet] = useState<GiwaWallet | null>(null);
  const [adapters, setAdapters] = useState<Adapters | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [walletManager, setWalletManager] = useState<WalletManager | null>(null);

  // Create client (memoized)
  const client = useMemo(() => {
    return new GiwaClient(config);
  }, [config.network, config.customRpcUrl]);

  // Create managers (memoized, dependent on client)
  const tokenManager = useMemo(() => new TokenManager(client), [client]);
  const bridgeManager = useMemo(() => new BridgeManager(client), [client]);
  const flashblocksManager = useMemo(
    () => new FlashblocksManager(client, config.enableFlashblocks),
    [client, config.enableFlashblocks]
  );
  const giwaIdManager = useMemo(() => new GiwaIdManager(client), [client]);
  const dojangManager = useMemo(() => new DojangManager(client), [client]);

  // Initialize adapters
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      setIsLoading(true);
      setError(null);

      try {
        const factory = AdapterFactory.getInstance({
          forceEnvironment,
        });

        const env = await factory.detectEnvironment();
        if (!mounted) return;

        setEnvironment(env);

        if (env === 'unsupported') {
          throw new Error(
            '보안 저장소를 찾을 수 없습니다. expo-secure-store 또는 react-native-keychain을 설치해주세요.'
          );
        }

        const adapterInstances = await factory.getAdapters();
        if (!mounted) return;

        setAdapters(adapterInstances);

        // Create wallet manager with secure storage
        const manager = new WalletManager(adapterInstances.secureStorage);
        setWalletManager(manager);

        // Try to load existing wallet if autoConnect is enabled
        if (config.autoConnect !== false) {
          const existingWallet = await manager.loadWallet();
          if (existingWallet && mounted) {
            setWallet(existingWallet);

            // Set account in client
            const account = manager.getAccount();
            if (account) {
              client.setAccount(account);
            }
          }
        }

        if (mounted) {
          setIsInitialized(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('초기화 실패'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [forceEnvironment, config.autoConnect, client]);

  // Update client account when wallet changes
  const handleSetWallet = useCallback(
    (newWallet: GiwaWallet | null) => {
      setWallet(newWallet);

      if (newWallet && walletManager) {
        const account = walletManager.getAccount();
        if (account) {
          client.setAccount(account);
        }
      } else {
        client.clearAccount();
      }
    },
    [client, walletManager]
  );

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo<GiwaContextState | null>(() => {
    if (!walletManager) {
      return null;
    }

    return {
      client,
      walletManager,
      tokenManager,
      bridgeManager,
      flashblocksManager,
      giwaIdManager,
      dojangManager,
      adapters,
      wallet,
      setWallet: handleSetWallet,
      isInitialized,
      isLoading,
      error,
      environment,
      network: config.network || 'testnet',
    };
  }, [
    client,
    walletManager,
    tokenManager,
    bridgeManager,
    flashblocksManager,
    giwaIdManager,
    dojangManager,
    adapters,
    wallet,
    handleSetWallet,
    isInitialized,
    isLoading,
    error,
    environment,
    config.network,
  ]);

  // Show loading or error state
  if (isLoading) {
    return <>{children}</>;
  }

  if (error) {
    console.error('GIWA Provider Error:', error);
    return <>{children}</>;
  }

  if (!contextValue) {
    return <>{children}</>;
  }

  return (
    <GiwaContext.Provider value={contextValue}>{children}</GiwaContext.Provider>
  );
}

/**
 * Hook to access GIWA context
 * Must be used within GiwaProvider
 */
export function useGiwaContext(): GiwaContextState {
  const context = useContext(GiwaContext);

  if (context === undefined) {
    throw new Error('useGiwaContext must be used within a GiwaProvider');
  }

  return context;
}

// Export context for advanced usage
export { GiwaContext };
