const SALT_KEY = "beleza_salt";

function b64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function deriveKey(pin, salt) {
  const material = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function decryptText(key, b64) {
  if (!b64) return b64;
  const bytes = b64ToBytes(b64);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: bytes.slice(0, 12) },
    key,
    bytes.slice(12)
  );
  return new TextDecoder().decode(decrypted);
}

export async function getKeyFromPin(pin) {
  const saltB64 = localStorage.getItem(SALT_KEY);
  if (!saltB64) return null;
  return deriveKey(pin, b64ToBytes(saltB64));
}

export function clearPinStorage() {
  localStorage.removeItem(SALT_KEY);
  localStorage.removeItem("beleza_verify");
}
