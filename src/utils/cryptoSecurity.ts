/**
 * Enhanced cryptographic security utilities
 * Replaces weak hash functions with secure implementations
 */

// Secure hash function using Web Crypto API
export const secureHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Generate secure random salt
export const generateSalt = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Secure hash with salt
export const hashWithSalt = async (data: string, salt?: string): Promise<{ hash: string; salt: string }> => {
  const usedSalt = salt || generateSalt();
  const saltedData = data + usedSalt;
  const hash = await secureHash(saltedData);
  return { hash, salt: usedSalt };
};

// Verify hash with salt
export const verifyHash = async (data: string, hash: string, salt: string): Promise<boolean> => {
  const { hash: computedHash } = await hashWithSalt(data, salt);
  return computedHash === hash;
};

// Generate secure random nonce for blockchain
export const generateNonce = (): number => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0];
};

// Secure timestamp validation
export const validateTimestamp = (timestamp: number, maxAge: number = 300000): boolean => {
  const now = Date.now();
  return Math.abs(now - timestamp) <= maxAge;
};

// Enhanced digital signature simulation
export const generateSecureSignature = async (data: string, privateKey: string): Promise<string> => {
  const combinedData = data + privateKey;
  const hash = await secureHash(combinedData);
  return `sig_${hash.substring(0, 64)}`;
};

// Verify digital signature
export const verifySignature = async (data: string, signature: string, publicKey: string): Promise<boolean> => {
  const expectedSignature = await generateSecureSignature(data, publicKey);
  return signature === expectedSignature;
};