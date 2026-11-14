import 'server-only';
import { randomBytes } from 'node:crypto';
import { UniqueConstraintError } from 'sequelize';
import { Doorbell } from '../models/Index.js';

/**
 * @param {{ userId: number, label: string }} input
 * @returns {Promise<{ id: number, label: string, token: string, active: boolean }>}
 */
export async function createDoorbellForUser({ userId, label }) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const doorbell = await Doorbell.create({
        user_id: userId,
        label,
        token: randomBytes(16).toString('hex'),
      });

      return {
        id: doorbell.id,
        label: doorbell.label,
        token: doorbell.token,
        active: doorbell.active,
      };
    } catch (error) {
      if (!(error instanceof UniqueConstraintError) || attempt === 2) {
        throw error;
      }
    }
  }

  throw new Error('Unable to generate a unique doorbell token.');
}
