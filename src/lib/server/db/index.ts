import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL no está definida');

const cliente = new Database(env.DATABASE_URL);
cliente.pragma('foreign_keys = ON');

export const db = drizzle(cliente);
