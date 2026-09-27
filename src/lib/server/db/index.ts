import { existsSync } from 'node:fs';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

// Ni Node ni Vite ponen .env en process.env, así que se carga acá (igual que en drizzle.config.ts).
if (existsSync('.env')) process.loadEnvFile();
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL no está definida');

const cliente = new Database(process.env.DATABASE_URL);
cliente.pragma('foreign_keys = ON');

export const db = drizzle(cliente);

// Único lugar que conoce el código de error del motor: al cambiar de base, se cambia acá.
export function esRechazoPorClaveForanea(e: unknown): boolean {
	return e instanceof Error && 'code' in e && e.code === 'SQLITE_CONSTRAINT_FOREIGNKEY';
}
