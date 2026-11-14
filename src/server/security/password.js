import 'server-only';
import { promisify } from 'node:util';
import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';

const scrypt = promisify(scryptCallback);

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);

  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password, passwordHash) {
  const [algorithm, salt, storedKey] = passwordHash.split(':');
  if (
    algorithm !== 'scrypt' ||
    !/^[a-f0-9]{32}$/i.test(salt ?? '') ||
    !/^[a-f0-9]{128}$/i.test(storedKey ?? '')
  ) {
    return false;
  }

  const derivedKey = await scrypt(password, salt, 64);
  const expectedKey = Buffer.from(storedKey, 'hex');

  return timingSafeEqual(derivedKey, expectedKey);
}
