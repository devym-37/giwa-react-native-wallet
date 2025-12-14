import { GiwaSecurityError, ErrorCodes } from './errors';

/**
 * Validate that secure storage is available
 * Throws GiwaSecurityError if not available
 */
export async function validateSecureStorage(
  isAvailable: () => Promise<boolean>
): Promise<void> {
  const available = await isAvailable();
  if (!available) {
    throw new GiwaSecurityError(
      '보안 저장소를 사용할 수 없습니다. 이 기기에서는 지갑을 사용할 수 없습니다.'
    );
  }
}

/**
 * Check if running in Expo environment
 */
export function isExpoEnvironment(): boolean {
  try {
    // Check for Expo constants
    const expoConstants = require('expo-constants');
    return expoConstants?.default?.expoConfig !== undefined;
  } catch {
    return false;
  }
}

/**
 * Check if expo-secure-store is available
 */
export async function isExpoSecureStoreAvailable(): Promise<boolean> {
  try {
    const SecureStore = require('expo-secure-store');
    // Try a simple operation to verify it works
    await SecureStore.isAvailableAsync();
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if react-native-keychain is available
 */
export async function isRNKeychainAvailable(): Promise<boolean> {
  try {
    const Keychain = require('react-native-keychain');
    // Check if the module has the expected methods
    return typeof Keychain.setGenericPassword === 'function';
  } catch {
    return false;
  }
}

/**
 * Detect the current environment
 */
export type Environment = 'expo' | 'react-native' | 'unsupported';

export async function detectEnvironment(): Promise<Environment> {
  // Check Expo first
  if (await isExpoSecureStoreAvailable()) {
    return 'expo';
  }

  // Check React Native Keychain
  if (await isRNKeychainAvailable()) {
    return 'react-native';
  }

  return 'unsupported';
}

/**
 * Ensure secure storage is available, throw if not
 */
export async function ensureSecureStorageAvailable(): Promise<Environment> {
  const env = await detectEnvironment();

  if (env === 'unsupported') {
    throw new GiwaSecurityError(
      '보안 저장소를 찾을 수 없습니다. expo-secure-store 또는 react-native-keychain을 설치해주세요.'
    );
  }

  return env;
}

export { ErrorCodes };
