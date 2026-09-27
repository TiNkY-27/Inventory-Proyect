import { integer, sqliteTable, text, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export const ubicaciones = sqliteTable('ubicaciones', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nombre: text('nombre').notNull(),
	nivel: integer('nivel').notNull(),
	padreId: integer('padre_id').references((): AnySQLiteColumn => ubicaciones.id)
});

export const nombresNivel = sqliteTable('nombres_nivel', {
	nivel: integer('nivel').primaryKey(),
	nombre: text('nombre').notNull()
});
