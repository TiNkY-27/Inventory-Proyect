# #003 — Crear el bloque Ubicaciones

- Estado: hecha
- Decisión origen: D-001, D-003
- Objetivo: definir la estructura física del negocio en tres niveles, con nombres de nivel configurables.
- Alcance: src/lib/server/ubicaciones/, la migración generada, src/routes/ubicaciones/. En el menú del layout, solo agregar el enlace Ubicaciones. NO tocar catalogo/ ni la página "/".
- Restricciones:
  - Una sola tabla de ubicaciones: id, nombre, nivel (1, 2 o 3) y ubicación padre. El nivel 1 no tiene padre; el padre de un nivel 2 es de nivel 1, y el de un nivel 3 es de nivel 2.
  - El nombre es obligatorio y no se repite entre hermanos (mismo padre; los de nivel 1 son hermanos entre sí).
  - Una tabla guarda los nombres de los tres niveles. Si no hay nombres configurados, el bloque devuelve los predeterminados: Pasillo, Estantería, Estante.
    - Para reconocer errores de la base (por ejemplo, un rechazo por clave foránea), usar las funciones de db/ (#008). No reconocer códigos de error propios del motor.
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

**Qué hice:**
- src/lib/server/ubicaciones/tablas.ts: dos tablas.
  - ubicaciones: id, nombre, nivel y padre_id, con clave foránea a la propia tabla.
  - nombres_nivel: una fila por nivel, con su nombre.
- src/lib/server/ubicaciones/index.ts: expone crear, renombrar, eliminar, listarArbol, obtenerRuta, listarNivel3 (cada ubicación de nivel 3 con su ruta), obtenerNombresNivel, cambiarNombresNivel y la tabla ubicaciones. También exporta los tipos que usa la pantalla.
  - Las validaciones están en el bloque.
  - El nivel no se recibe: se deduce del padre (sin padre es nivel 1). Crear debajo del nivel 3 se rechaza.
  - El rechazo por clave foránea se reconoce con esRechazoPorClaveForanea de db/ (#008).
  - Sigue D-004: sin imports de SvelteKit.
- Migración drizzle/0001_pretty_maximus.sql, aplicada sobre local.db.
- src/routes/ubicaciones/:
  - Alta de nivel 1 arriba y el árbol debajo. Cada nodo muestra el nombre de su nivel como rótulo y tiene Renombrar, Eliminar (con confirmación) y, si su nivel es menor que 3, "Agregar <nombre del nivel siguiente>".
  - Al final está el formulario de nombres de nivel.
  - Cada error se muestra junto al formulario que lo produjo.
- src/routes/+layout.svelte: solo agregué el enlace Ubicaciones al menú.

**Verificación:**
- npm run db:generate y db:migrate funcionan. npm run check: 0 errores, 0 advertencias.
- Pruebas contra el servidor dev con una base temporal (fuera del proyecto), simulando un navegador sin JavaScript:
  - Se armó Pasillo A > Estantería 1 > Estante 1, con niveles 1, 2 y 3.
  - La pantalla no muestra "Agregar" debajo de un nivel 3. Un POST armado a mano se rechaza con "No se pueden crear ubicaciones por debajo del nivel 3.", que se ve junto al nodo.
  - Nombre repetido entre hermanas: "pasillo a" contra "Pasillo A" y "ESTANTERÍA 1" contra "Estantería 1" se rechazan con "Ya existe «…» en el mismo lugar.". El mismo nombre con otro padre se acepta. Renombrar a una hermana se rechaza; renombrarse a sí misma con otra capitalización se acepta. Nombre vacío se rechaza.
  - Eliminar con hijas: "No se puede eliminar: tiene ubicaciones adentro.". Eliminar una hoja libre funciona.
  - Eliminar referenciada: con una tabla temporal que referencia a ubicaciones, responde "No se puede eliminar: está en uso".
  - Nombres de nivel: al cambiarlos a Zona / Rack / Bandeja, cambian los rótulos de los nodos, "Nuevo Zona" y "Agregar Rack / Agregar Bandeja". Un nombre vacío se rechaza. Sin nombres configurados, se muestran Pasillo / Estantería / Estante.
  - El menú muestra Inicio, Productos y Ubicaciones en /, /productos y /ubicaciones.
- obtenerRuta y listarNivel3 (la pantalla todavía no los usa) los probé con un script temporal fuera del proyecto, ejecutado con npx tsx. Rutas: "Pasillo A > Estantería 1 > Estante 10", "Pasillo A" para un nivel 1, e undefined para un id inexistente. tsx resolvió el alias $lib sin configuración extra, lo que sirve para #005.
- grep: nada fuera de cada bloque importa su tablas.ts. "SQLITE_" solo aparece en db/. No toqué catalogo/ ni la página "/".

**Desvíos y observaciones:**
- El orden (árbol y listarNivel3) y la comparación de nombres repetidos se hacen en JavaScript con localeCompare en español: sin distinguir mayúsculas ni acentos y con orden numérico natural ("Estante 2" antes que "Estante 10"). Lo hice así porque lower() de SQLite no convierte letras acentuadas. Consecuencia: "Estantería" y "Estanteria" cuentan como repetidas.
- No hay restricciones en la base para nivel (1 a 3) ni para nombres únicos entre hermanas. Las valida el bloque, como pide D-003. Un índice único no cubriría el nivel 1 (padre nulo) ni las mayúsculas.
- La clave foránea padre_id deja la acción por defecto de la base (no action), que impide borrar una ubicación con hijas. El bloque igual lo chequea antes, para dar un mensaje propio.
- cambiarNombresNivel guarda los tres nombres juntos, en una transacción con "insert … on conflict do update" (también existe en PostgreSQL). #005 puede restablecer los predeterminados pasándole Pasillo / Estantería / Estante.
- Sin JavaScript, un error en el alta o el renombrado de un nodo no conserva lo que se escribió; con JavaScript sí. Con JavaScript, el desplegable de Renombrar o Agregar se cierra solo cuando la acción sale bien.
