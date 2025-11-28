import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();


const PASSPHRASE = process.env.MESSAGE_SECRET_KEY || "change_this_in_env_now";

const KEY = crypto.createHash("sha256").update(PASSPHRASE).digest(); 
const ALGO = "aes-256-cbc";

export function encryptValue(plain) {
  if (!plain) return null;

  const iv = crypto.randomBytes(16); 
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);

  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);

  return iv.toString("base64") + ":" + encrypted.toString("base64");
}

export function decryptValue(stored) {
  if (!stored) return null;

  const parts = stored.split(":");
  if (parts.length !== 2) return null;

  const [ivB64, encB64] = parts;
  const iv = Buffer.from(ivB64, "base64");
  const enc = Buffer.from(encB64, "base64");

  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  const decrypted = Buffer.concat([decipher.update(enc), decipher.final()]);

  return decrypted.toString("utf8");
}
