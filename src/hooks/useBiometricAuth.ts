import { useState, useCallback, useEffect, useMemo } from 'react';
import { useGiwaManagers } from '../providers/GiwaProvider';
import type { BiometricCapability, BiometricType } from '../types';

export interface UseBiometricAuthOptions {
  /** Default prompt message for authentication */
  defaultPromptMessage?: string;
}

export interface UseBiometricAuthReturn {
  /** Whether biometric hardware is available */
  isAvailable: boolean;
  /** Whether biometrics are enrolled on the device */
  isEnrolled: boolean;
  /** Type of biometric available (fingerprint, face, iris, none) */
  biometricType: BiometricType;
  /** Full capability information */
  capability: BiometricCapability | null;
  /** Whether capability check is in progress */
  isLoading: boolean;
  /** Error if capability check failed */
  error: Error | null;
  /** Authenticate using biometrics */
  authenticate: (promptMessage?: string) => Promise<boolean>;
  /** Refresh capability information */
  refreshCapability: () => Promise<void>;
}

/**
 * Hook for biometric authentication
 *
 * Provides access to device biometric capabilities and authentication.
 *
 * @example
 * ```tsx
 * function SecureAction() {
 *   const {
 *     isAvailable,
 *     biometricType,
 *     authenticate,
 *   } = useBiometricAuth();
 *
 *   const handleSecureAction = async () => {
 *     if (!isAvailable) {
 *       Alert.alert('Biometrics not available');
 *       return;
 *     }
 *
 *     const success = await authenticate('Confirm to proceed');
 *     if (success) {
 *       // Perform secure action
 *     }
 *   };
 *
 *   return (
 *     <Button
 *       title={`Authenticate with ${biometricType}`}
 *       onPress={handleSecureAction}
 *     />
 *   );
 * }
 * ```
 */
export function useBiometricAuth(
  options: UseBiometricAuthOptions = {}
): UseBiometricAuthReturn {
  const { defaultPromptMessage = 'Authentication required' } = options;
  const managers = useGiwaManagers();

  const [capability, setCapability] = useState<BiometricCapability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const adapters = managers?.adapters ?? null;
  const biometricAuth = adapters?.biometricAuth ?? null;

  // Check capability on mount
  const checkCapability = useCallback(async () => {
    if (!biometricAuth) {
      setCapability({
        isAvailable: false,
        biometricType: 'none',
        isEnrolled: false,
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cap = await biometricAuth.getCapability();
      setCapability(cap);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to check biometric capability'));
      setCapability({
        isAvailable: false,
        biometricType: 'none',
        isEnrolled: false,
      });
    } finally {
      setIsLoading(false);
    }
  }, [biometricAuth]);

  // Check capability on mount and when biometricAuth changes
  useEffect(() => {
    checkCapability();
  }, [checkCapability]);

  // Authenticate function
  const authenticate = useCallback(
    async (promptMessage?: string): Promise<boolean> => {
      if (!biometricAuth) {
        throw new Error('Biometric authentication not available');
      }

      if (!capability?.isAvailable || !capability?.isEnrolled) {
        throw new Error('Biometrics not available or not enrolled');
      }

      try {
        return await biometricAuth.authenticate(promptMessage ?? defaultPromptMessage);
      } catch (err) {
        throw err instanceof Error ? err : new Error('Biometric authentication failed');
      }
    },
    [biometricAuth, capability, defaultPromptMessage]
  );

  // Refresh capability
  const refreshCapability = useCallback(async () => {
    await checkCapability();
  }, [checkCapability]);

  // Memoize return value
  return useMemo(
    () => ({
      isAvailable: capability?.isAvailable ?? false,
      isEnrolled: capability?.isEnrolled ?? false,
      biometricType: capability?.biometricType ?? 'none',
      capability,
      isLoading,
      error,
      authenticate,
      refreshCapability,
    }),
    [capability, isLoading, error, authenticate, refreshCapability]
  );
}
