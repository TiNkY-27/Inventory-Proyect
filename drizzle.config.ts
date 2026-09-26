import { existsSync } from 'node:fs';
import { defineConfig } from 'drizzle-kit';

// drizzle-kit corre fuera de Vite, así que carga .env por su cuenta.
if (existsSync('.env')) process.loadEnvFile();
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL no está definida');

export default defineConfig({
	schema: './src/lib/server/*/tablas.ts',
	out: './drizzle',
	dialect: 'sqlite',
	dbCredentials: { url: process.env.DATABASE_URL },
	strict: true,
	verbose: true
});
