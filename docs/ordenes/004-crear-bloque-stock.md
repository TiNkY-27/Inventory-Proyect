# #004 — Crear el bloque Stock

- Estado: pendiente
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
- Terminado cuando:
  - npm run check sin errores. La migración se genera y se aplica.
  - Un producto asignado a dos estantes muestra ambos y el total correcto.
  - Poner 0 lo quita de la lista. Un valor negativo se rechaza con un mensaje.
  - Eliminar un producto o un estante con stock muestra "No se puede eliminar: está en uso".

## Notas del constructor
