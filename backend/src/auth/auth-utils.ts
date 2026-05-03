import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);

export const AUTH_COOKIE_NAME = "vm_session";

type SessionPayload = {
  userId: string;
  email: string;
  role: string;
  exp: number;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET || process.env.ADMIN_TOKEN;

  if (!secret) {
    throw new Error("AUTH_SECRET or ADMIN_TOKEN is required for auth sessions");
  }

  return secret;
}

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function sign(data: string) {
  return base64url(createHmac("sha256", getAuthSecret()).update(data).digest());
}


export function createPasswordResetToken() {
  return randomBytes(32).toString("hex");
}

export function hashPasswordResetToken(token: string) {
  return createHmac("sha256", getAuthSecret())
    .update(`password-reset:${String(token || "")}`)
    .digest("hex");
}

export async function hashPassword(password: string) {
  const normalized = String(password || "");

  if (normalized.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(normalized, salt, 64)) as Buffer;

  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  if (!passwordHash || !passwordHash.startsWith("scrypt:")) {
    return false;
  }

  const [, salt, storedHex] = passwordHash.split(":");

  if (!salt || !storedHex) {
    return false;
  }

  const stored = Buffer.from(storedHex, "hex");
  const derived = (await scrypt(String(password || ""), salt, stored.length)) as Buffer;

  if (stored.length !== derived.length) {
    return false;
  }

  return timingSafeEqual(stored, derived);
}

export function createSessionToken(input: {
  userId: string;
  email: string;
  role: string;
  maxAgeSeconds?: number;
}) {
  const maxAgeSeconds = input.maxAgeSeconds ?? 60 * 60 * 24 * 30;

  const payload: SessionPayload = {
    userId: input.userId,
    email: input.email,
    role: input.role,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };

  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expected = sign(encodedPayload);

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  if (
    expectedBuffer.length !== actualBuffer.length ||
    !timingSafeEqual(expectedBuffer, actualBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(
        encodedPayload.replaceAll("-", "+").replaceAll("_", "/"),
        "base64",
      ).toString("utf8"),
    ) as SessionPayload;

    if (!payload.userId || !payload.email || !payload.exp) {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader?: string) {
  const out: Record<string, string> = {};

  for (const part of String(cookieHeader || "").split(";")) {
    const [rawKey, ...rawValue] = part.trim().split("=");

    if (!rawKey) continue;

    out[rawKey] = decodeURIComponent(rawValue.join("="));
  }

  return out;
}

export function getSessionFromCookie(cookieHeader?: string) {
  const cookies = parseCookies(cookieHeader);
  return verifySessionToken(cookies[AUTH_COOKIE_NAME]);
}

export function buildSessionCookie(token: string, maxAgeSeconds = 60 * 60 * 24 * 30) {
  return [
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${maxAgeSeconds}`,
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ].join("; ");
}

export function buildLogoutCookie() {
  return [
    `${AUTH_COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ].join("; ");
}
