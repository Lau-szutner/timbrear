import { Doorbell, Ring } from '../models/Index';

export const DEMO_TOKEN = 'demo1234abcd';

export async function findActiveDoorbellByToken(token) {
  if (token === DEMO_TOKEN) {
    return { id: null, label: 'Departamento demo' };
  }

  return Doorbell.findOne({ where: { token, active: true } });
}

export async function createRing({ token, type, message }) {
  if (token === DEMO_TOKEN) {
    return { id: null, status: 'sent' };
  }

  const doorbell = await findActiveDoorbellByToken(token);
  if (!doorbell) return null;

  return Ring.create({
    doorbell_id: doorbell.id,
    type,
    message: message || null,
  });
}
