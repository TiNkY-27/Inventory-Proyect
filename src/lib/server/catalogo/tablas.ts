import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const productos = sqliteTable('productos', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nombre: text('nombre').notNull(),
	marca: text('marca'),
	categoria: text('categoria')
});
