# #004 — Crear el bloque Stock

- Estado: hecha
- Decisión origen: D-001, D-003
- Objetivo: registrar cuánto hay de cada producto en cada estante y verlo en la ficha del producto.
- Alcance: src/lib/server/stock/, la migración generada y una sección nueva de Stock en src/routes/productos/[id]/. NO modificar catalogo/ ni ubicaciones/: solo usar su index.ts.
- Restricciones:
  - Tabla de stock: producto, ubicación y cantidad (entero mayor que 0). El par producto-ubicación es único.
  - Claves foráneas con restricción al eliminar, de modo que la base impida borrar un producto o una ubicación que tengan stock.
  - Solo se puede asignar stock a ubicaciones de nivel 3.
  - Fijar la cantidad en 0 elimina el registro. Las cantidades negativas se rechazan.
  - index.ts expone: fijar la cantidad y obtener el stock de un producto (cada ubicación con su ruta y su cantidad, más el total).
  - En la pantalla: lista de ubicaciones con cantidad, el total y un formulario para asignar o ajustar (se elige un estante, mostrado con su ruta, y una cantidad).
    - Para reconocer errores de la base (por ejemplo, un rechazo por clave foránea), usar las funciones de db/ (#008). No reconocer códigos de error propios del motor.
- Terminado cuando:
  - npm run check sin errores. La migración se genera y se aplica.
  - Un producto asignado a dos estantes muestra ambos y el total correcto.
  - Poner 0 lo quita de la lista. Un valor negativo se rechaza con un mensaje.
  - Eliminar un producto o un estante con stock muestra "No se puede eliminar: está en uso".

## Notas del constructor

**Qué hice:**
- src/lib/server/stock/tablas.ts: tabla stock con producto_id, ubicacion_id y cantidad.
  - La clave primaria es el par producto-ubicación, así que el par es único.
  - Las claves foráneas apuntan a productos y ubicaciones, importadas desde sus index.ts (D-003).
  - Una restricción CHECK exige cantidad > 0.
- src/lib/server/stock/index.ts: expone fijarCantidad, obtenerStockDeProducto (cada ubicación con su ruta y su cantidad, más el total) y la tabla stock. También exporta sus tipos.
  - fijarCantidad valida que la cantidad sea un entero no negativo, que el producto exista y que la ubicación sea de nivel 3 (lo comprueba con ubicaciones.listarNivel3).
  - Con 0 borra el registro; si no, inserta o actualiza con "on conflict do update".
  - Usa solo el index.ts de catalogo y ubicaciones. No toqué esos bloques.
- Migraciones drizzle/0002_nasty_shaman.sql (crea stock) y drizzle/0003_blue_jane_foster.sql (cambia la acción de las claves foráneas; ver desvíos), aplicadas sobre local.db.
- src/routes/productos/[id]/: sección Stock debajo de la edición.
  - Muestra la tabla con ruta y cantidad, y el total. Sin registros, dice "Sin stock.".
  - Formulario con un desplegable de ubicaciones de nivel 3 (mostradas con su ruta) y la cantidad. Los rótulos usan el nombre configurado del nivel 3.
  - Si no hay ubicaciones de nivel 3, en lugar del formulario hay un enlace a Ubicaciones.

**Verificación:**
- npm run db:generate y db:migrate funcionan. npm run check: 0 errores, 0 advertencias.
- Pruebas contra el servidor dev con una base temporal (fuera del proyecto), simulando un navegador sin JavaScript:
  - Asignar 5 al Estante 1 y 7 al Estante 2 muestra las dos rutas y un total de 12. Ajustar a 2 actualiza el mismo registro (total 9, sin duplicado). Poner 0 lo quita de la lista (total 2).
  - Rechazos con mensaje:
    - -1: "La cantidad no puede ser negativa."
    - 1.5 o texto: "La cantidad debe ser un número entero."
    - Cantidad vacía o sin ubicación elegida: mensaje propio de cada caso.
    - Una ubicación de nivel 1 o inexistente: "Solo se puede asignar stock a ubicaciones del último nivel."
    - Ante un error se conservan los valores elegidos.
  - Eliminar un producto o un estante con stock responde 409 con "No se puede eliminar: está en uso", con y sin JavaScript. Sin stock, se eliminan normalmente.
  - Editar el producto sigue funcionando: redirige, y sin nombre se rechaza.
  - En la base: insertar cantidad 0 falla por la restricción CHECK, y un par repetido falla por la clave primaria.
  - La migración 0003 se aplicó sobre una base con stock y conservó los datos y la restricción CHECK.
- grep: stock solo usa los index.ts de catalogo, ubicaciones y db. Ningún otro bloque importa stock. "SQLITE_" solo aparece en db/. No hay imports de SvelteKit en src/lib/server/.

**Desvíos y problemas:**
- Claves foráneas: primero las definí con ON DELETE RESTRICT. Con RESTRICT, SQLite informa el rechazo con el código SQLITE_CONSTRAINT_TRIGGER en lugar de SQLITE_CONSTRAINT_FOREIGNKEY. Por eso esRechazoPorClaveForanea (db/) no lo reconocía, y eliminar un producto con stock daba error 500. Tocar db/ estaba fuera del alcance, así que las dejé con NO ACTION (la acción por defecto). Con claves no diferidas, NO ACTION también hace que la base impida el borrado, que es el propósito de la restricción. En PostgreSQL, RESTRICT y NO ACTION dan el mismo error (23503). Como la 0002 ya estaba aplicada en local.db, el cambio va en una migración nueva (0003) en lugar de reescribir la 0002. Si se prefiere RESTRICT literal, hace falta una orden que amplíe esRechazoPorClaveForanea para reconocer también ese código.
- La migración 0003 la generó drizzle-kit con PRAGMA foreign_keys y recreación de tabla, que es propio de SQLite. Las migraciones dependen del motor en cualquier caso: al pasar a PostgreSQL se generan de nuevo.
- La acción de edición de la ficha pasó de "default" a una acción con nombre ("editar"), porque SvelteKit no permite mezclar la acción default con otras con nombre. El formulario de edición ahora apunta a ?/editar. El comportamiento es el mismo.
- Que la ubicación esté elegida y la cantidad no esté vacía lo controla la pantalla, porque es interpretar el formulario (un campo vacío no debe convertirse en 0). Las reglas de datos (entero, no negativa, nivel 3) están en el bloque.
- La ficha pide tres cosas por separado: el stock (Stock), la lista de estantes para el desplegable y el nombre del nivel 3 (Ubicaciones). obtenerStockDeProducto consulta el stock del producto y lo combina en memoria con listarNivel3, en vez de hacer una consulta por ubicación.
