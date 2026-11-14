# Decisiones de TimbreAR

## Alcance del MVP

Residente crea timbre → QR → visitante escanea → residente recibe aviso.

## Fuera del MVP

Varios usuarios por depto, panel de consorcios, historial avanzado, pagos.

## Stack

Next.js (App Router, src/) + TypeScript + Tailwind, Sequelize + MySQL.

## Estructura

- src/app: rutas, páginas y API routes
- src/server: config, models y services (solo servidor)
- db: migraciones

## Pendientes de decidir

- Canal de notificación (candidato: Telegram)
