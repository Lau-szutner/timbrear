import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'timbrear_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error('AUTH_SECRET must contain at least 32 bytes.');
  }
  return secret;
}

export function assertAuthConfigured() {
  getAuthSecret();
}

function sign(payload) {
  return createHmac('sha256', getAuthSecret())
    .update(payload)
    .digest('base64url');
}

export function createSessionToken(userId) {
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      expiresAt: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
    }),
  ).toString('base64url');

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;

  const expectedSignature = Buffer.from(sign(payload));
  const actualSignature = Buffer.from(signature);
  if (
    expectedSignature.length !== actualSignature.length ||
    !timingSafeEqual(expectedSignature, actualSignature)
  ) {
    return null;
  }

  try {
    const data = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    );
    if (
      !Number.isSafeInteger(data.userId) ||
      !Number.isSafeInteger(data.expiresAt) ||
      data.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return { userId: data.userId };
  } catch {
    return null;
  }
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  return verifySessionToken(token);
}
