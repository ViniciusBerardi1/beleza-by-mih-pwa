const SALT_KEY = "beleza_salt";
const VERIFY_KEY = "beleza_verify";

let _key = null;

export function setActiveKey(key) { _key = key; }
export function getActiveKey() { return _key; }
export function hasPinSetup() { return !!localStorage.getItem(SALT_KEY); }

function b64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToB64(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
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

export async function setupPin(pin) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_KEY, bytesToB64(salt));
  const key = await deriveKey(pin, salt);
  localStorage.setItem(VERIFY_KEY, await encryptText(key, "beleza-by-mih-v1"));
  setActiveKey(key);
  return key;
}

export async function unlockWithPin(pin) {
  const saltB64 = localStorage.getItem(SALT_KEY);
  if (!saltB64) return null;
  const key = await deriveKey(pin, b64ToBytes(saltB64));
  try {
    await decryptText(key, localStorage.getItem(VERIFY_KEY));
    setActiveKey(key);
    return key;
  } catch {
    return null;
  }
}

export async function encryptText(key, text) {
  if (!text) return text;
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(String(text))
  );
  const result = new Uint8Array(12 + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), 12);
  return bytesToB64(result);
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
