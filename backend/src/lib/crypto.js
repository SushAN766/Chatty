// backend/src/lib/crypto.js
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const PASSPHRASE = process.env.MESSAGE_SECRET_KEY;
const KEY = crypto.createHash("sha256").update(PASSPHRASE).digest();
const ALGO = "aes-256-cbc";

// Encrypt plain text
export function encryptValue(plain) {
  if (!plain) return null;

  // Already encrypted? avoid double-encryption
  if (plain.includes(":")) return plain;

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);

  return iv.toString("base64") + ":" + encrypted.toString("base64");
}

// Decrypt encrypted or plain text safely
export function decryptValue(stored) {
  if (!stored) return null;

  // If not encrypted, return plain text
  if (!stored.includes(":")) {
    return stored;
  }

  try {
    const [ivB64, encB64] = stored.split(":");
    const iv = Buffer.from(ivB64, "base64");
    const enc = Buffer.from(encB64, "base64");

    const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
    const decrypted = Buffer.concat([
      decipher.update(enc),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (err) {
    console.error("Safe decrypt fallback:", err.message);
    // return original on failure
    return stored;
  }
}
