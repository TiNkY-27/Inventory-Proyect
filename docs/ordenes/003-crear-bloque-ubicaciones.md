# #003 — Crear el bloque Ubicaciones

- Estado: pendiente
- Decisión origen: D-001, D-003
- Objetivo: definir la estructura física del negocio en tres niveles, con nombres de nivel configurables.
- Alcance: src/lib/server/ubicaciones/, la migración generada, src/routes/ubicaciones/. En el menú del layout, solo agregar el enlace Ubicaciones. NO tocar catalogo/ ni la página "/".
- Restricciones:
  - Una sola tabla de ubicaciones: id, nombre, nivel (1, 2 o 3) y ubicación padre. El nivel 1 no tiene padre; el padre de un nivel 2 es de nivel 1, y el de un nivel 3 es de nivel 2.
  - El nombre es obligatorio y no se repite entre hermanos (mismo padre; los de nivel 1 son hermanos entre sí).
  - Una tabla guarda los nombres de los tres niveles. Si no hay nombres configurados, el bloque devuelve los predeterminados: Pasillo, Estantería, Estante.
  - index.ts expone: crear, renombrar, eliminar (rechaza si la ubicación tiene hijas), listar como árbol, obtener la ruta completa de una ubicación (los nombres desde el nivel 1 hasta ella, separados por " > "), listar las de nivel 3 con su ruta, leer y cambiar los nombres de nivel, y la tabla.
  - No se pueden mover ubicaciones a otro padre en el MVP.
  - Si la base rechaza una eliminación, la pantalla muestra "No se puede eliminar: está en uso".
- Terminado cuando:
  - npm run check sin errores. La migración se genera y se aplica.
  - Se puede armar Pasillo A > Estantería 1 > Estante 1 desde la pantalla, y la interfaz no ofrece crear un nivel por debajo del 3.
  - Un nombre repetido entre hermanos se rechaza con un mensaje.
  - Eliminar una ubicación con hijas se rechaza con un mensaje.
  - Cambiar los nombres de nivel cambia los rótulos de la pantalla.

## Notas del constructor
