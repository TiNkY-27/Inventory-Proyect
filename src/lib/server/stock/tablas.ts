import { check, integer, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { productos } from '$lib/server/catalogo';
import { ubicaciones } from '$lib/server/ubicaciones';

export const stock = sqliteTable(
	'stock',
	{
		productoId: integer('producto_id')
			.notNull()
			.references(() => productos.id, { onDelete: 'no action' }),
		ubicacionId: integer('ubicacion_id')
			.notNull()
			.references(() => ubicaciones.id, { onDelete: 'no action' }),
		cantidad: integer('cantidad').notNull()
	},
	(t) => [
		primaryKey({ columns: [t.productoId, t.ubicacionId] }),
		check('cantidad_positiva', sql`${t.cantidad} > 0`)
	]
);
