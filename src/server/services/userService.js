import 'server-only';
import { UniqueConstraintError } from 'sequelize';
import { User } from '../models/Index.js';
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
