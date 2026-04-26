import crypto from "crypto";

function getKey() {
  const secret = process.env.SECRET_KEY;

  if (!secret || secret.length < 32) {
    throw new Error("SECRET_KEY must be at least 32 characters");
  }

  return crypto.createHash("sha256").update(secret).digest();
}

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string) {
  const [ivHex, dataHex] = text.split(":");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    getKey(),
    Buffer.from(ivHex, "hex"),
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
