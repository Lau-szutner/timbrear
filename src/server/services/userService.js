import 'server-only';
import { UniqueConstraintError } from 'sequelize';
import { Doorbell, User } from '../models/Index.js';
import { hashPassword, verifyPassword } from '../security/password.js';

export async function registerUser({ email, password }) {
  try {
    const user = await User.create({
      email,
      password_hash: await hashPassword(password),
    });

    return { id: user.id, email: user.email };
  } catch (error) {
    if (error instanceof UniqueConstraintError) return null;
    throw error;
  }
}

export async function authenticateUser({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return null;
  }

  return { id: user.id, email: user.email };
}

/**
 * @param {number} userId
 * @returns {Promise<{
 *   user: { id: number, email: string },
 *   doorbells: { id: number, label: string, token: string, active: boolean }[]
 * } | null>}
 */
export async function getUserDashboard(userId) {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'email'],
  });
  if (!user) return null;

  const doorbells = await Doorbell.findAll({
    where: { user_id: userId },
    attributes: ['id', 'label', 'token', 'active'],
    order: [['createdAt', 'DESC']],
  });

  return {
    user: { id: user.id, email: user.email },
    doorbells: doorbells.map(({ id, label, token, active }) => ({
      id,
      label,
      token,
      active,
    })),
  };
}
