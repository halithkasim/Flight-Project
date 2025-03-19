/**
 * Generates a secure random string suitable for use as a JWT secret key
 * @param length The length of the secret key (default: 64)
 * @returns A secure random string
 */
export function generateSecretKey(length = 64): string {
  // Use Web Crypto API which works in both browser and Node.js environments
  const array = new Uint8Array(length)

  if (typeof window !== "undefined") {
    // Browser environment
    window.crypto.getRandomValues(array)
  } else {
    // Node.js environment - use a simple fallback for demo purposes
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }

  // Convert to base64 string
  return btoa(String.fromCharCode.apply(null, [...array]))
}

/**
 * Ensures a JWT secret is available, generating one if needed
 * @param existingSecret Optional existing secret from environment variables
 * @returns A JWT secret key
 */
export function ensureJwtSecret(existingSecret?: string): Uint8Array {
  // If an existing secret is provided, use it
  const secretString = existingSecret || generateSecretKey()

  // Convert to Uint8Array for jose library
  return new TextEncoder().encode(secretString)
}

// Example of generating a new secret key
// This can be run once to generate a key for your .env file
export function generateAndPrintSecretKey(): string {
  const secretKey = generateSecretKey()
  console.log("Generated JWT Secret Key:")
  console.log(secretKey)
  return secretKey
}

