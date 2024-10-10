import CryptoJS from 'crypto-js';

// Encrypt using CryptoJS with AES
export function encrypt(text: string, secretKey: string) {
  const iv = CryptoJS.lib.WordArray.random(16); // Generate random IV
  const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Hex.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // Return the iv and the encrypted data, separated by a colon
  return iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

// Decrypt using CryptoJS with AES
export function decrypt(encryptedData: string, secretKey: string) {
  const [ivHex, encryptedText] = encryptedData.split(':');
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const encryptedBytes = CryptoJS.enc.Hex.parse(encryptedText);

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encryptedBytes } as any, // Decrypt using the ciphertext
    CryptoJS.enc.Hex.parse(secretKey),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  // Return the decrypted text
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// Create a 32-byte random key and return it in Hex format
export function createSecretKey() {
  const secretKey = CryptoJS.lib.WordArray.random(32); // AES-256 requires a 32-byte key
  const secretKeyHex = secretKey.toString(CryptoJS.enc.Hex);
  return secretKeyHex;
}

// Restore the key from Hex format to WordArray
export function restoreSecretKey(secretKeyHex: string) {
  const secretKey = CryptoJS.enc.Hex.parse(secretKeyHex);
  return secretKey;
}
