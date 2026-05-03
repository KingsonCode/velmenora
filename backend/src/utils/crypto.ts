import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

function getKey() {
  const secret =
    process.env.SECRET_KEY ||
    process.env.BROKER_CREDENTIALS_SECRET ||
    process.env.ENCRYPTION_KEY ||
    process.env.APP_SECRET ||
    process.env.ADMIN_TOKEN;

  if (!secret || secret.length < 32) {
    throw new Error(
      "Encryption secret must be at least 32 characters. Set SECRET_KEY or BROKER_CREDENTIALS_SECRET.",
    );
  }

  return createHash("sha256").update(secret).digest();
}

export function encrypt(text: string) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string) {
  const [ivHex, dataHex] = text.split(":");

  if (!ivHex || !dataHex) {
    throw new Error("Invalid encrypted payload");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivHex, "hex"),
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
