# #005 — Cargar datos de ejemplo

- Estado: hecha
- Decisión origen: D-002, D-004
- Objetivo: tener un conjunto de datos fijo y reproducible para probar el MVP y, más adelante, verificar la migración a PostgreSQL.
- Alcance: carpeta scripts/datos-ejemplo/, con un archivo de datos y otro con la lógica de carga. En package.json, solo agregar tsx como dependencia de desarrollo y el script db:seed. NO modificar bloques, pantallas ni la conexión.
- Restricciones:
  - Rubro: ferretería.
  - El script se ejecuta con tsx (D-004).
  - Todo, tanto vaciar como cargar, se hace con las funciones que ya exponen los bloques, sin leer ni escribir las tablas directamente.
  - Para vaciar, se respeta este orden: primero se deja en 0 el stock de cada producto; después se eliminan las ubicaciones, desde el nivel 3 hacia el 1; después se eliminan los productos; por último se restablecen los nombres de nivel predeterminados.
  - Los datos son fijos, no aleatorios.
  - Si tsx no resuelve el alias $lib, o si falta en algún bloque una función necesaria, marcar la orden como bloqueada en lugar de resolverlo de otra forma.
  - Contenido: nombres de nivel predeterminados; 2 pasillos, cada uno con 3 estanterías de 3 estantes; unos 30 productos, con al menos 6 marcas y 5 categorías, y algunos sin marca; al menos 5 productos en 2 o más estantes; al menos 3 productos sin stock.
  - Es solo para desarrollo: no se ejecuta automáticamente.
- Terminado cuando:
  - npm run db:seed sobre una base migrada carga todo sin errores.
  - Ejecutarlo dos veces deja exactamente el mismo resultado, sin duplicados.
  - Los datos se ven en /productos, en /ubicaciones y en las fichas.

## Notas del constructor
**Qué hice:**
- scripts/datos-ejemplo/datos.ts: los datos fijos de una ferretería.
  - Nombres de nivel predeterminados.
  - 2 pasillos, cada uno con 3 estanterías de 3 estantes (18 estantes).
  - 30 productos: 11 marcas, 8 categorías y 5 productos sin marca.
  - El stock de cada producto se indica con la ruta del estante y la cantidad (35 registros). 8 productos están en 2 estantes y 3 no tienen stock.
- scripts/datos-ejemplo/cargar.ts: la lógica. Primero vacía, en el orden de la orden:
  1. stock en 0 de cada producto (listarTodos + obtenerStockDeProducto + fijarCantidad);
  2. ubicaciones del nivel 3 al 1 (listarArbol + eliminar);
  3. productos (listarTodos + eliminar);
  4. nombres de nivel predeterminados (cambiarNombresNivel).
  Después crea las ubicaciones, los productos y el stock. Usa solo funciones de los bloques: no lee ni escribe tablas. Si una función devuelve error, se detiene con un mensaje que dice qué falló y sale con código 1.
- package.json: tsx como dependencia de desarrollo y el script db:seed (tsx scripts/datos-ejemplo/cargar.ts). No se ejecuta automáticamente.

**Verificación:** todo sobre bases temporales fuera del proyecto.
- tsx resuelve el alias $lib sin configuración extra, así que no hubo motivo de bloqueo. Tampoco faltó ninguna función en los bloques.
- npm run db:seed sobre una base recién migrada: sin errores ("2 pasillos, 18 estantes, 30 productos").
- Dos corridas seguidas: comparé un volcado normalizado (nombres de nivel, rutas de ubicaciones, productos y stock por nombre y ruta, sin ids) y quedó idéntico, sin duplicados.
- Vaciado sobre bases con otros datos: con nombres de nivel cambiados a Zona/Rack/Bandeja, un producto y un pasillo extra, y con una base que había quedado a medio usar, la carga deja exactamente el mismo contenido que sobre una base limpia.
- Conteos verificados en la base: niveles Pasillo/Estantería/Estante; 2/6/18 ubicaciones por nivel; 30 productos, 11 marcas, 8 categorías, 5 sin marca; 8 en 2 o más estantes; 3 sin stock.
- Pantallas (servidor dev sobre la base cargada):
  - /productos lista los 30.
  - /ubicaciones muestra los 26 nodos con los rótulos predeterminados.
  - La ficha de «Martillo carpintero 16 oz» muestra sus dos estantes con total 18, y la de «Sierra caladora» dice "Sin stock.".
- tsc sin errores sobre scripts/, con una configuración temporal: svelte-check no revisa esa carpeta porque está fuera de src/. npm run check: 0 errores.

**Desvíos y observaciones:**
- Los ids no se repiten entre corridas: la primera deja los productos 1–30 y la segunda los 31–60. Las tablas usan AUTOINCREMENT y reiniciar los contadores requeriría escribir en tablas internas de SQLite, algo que la orden no permite. El contenido sí es idéntico, pero los enlaces a una ficha (/productos/<id>) cambian en cada carga.
- Restablecer los nombres de nivel deja guardados Pasillo/Estantería/Estante en la tabla nombres_nivel, en lugar de dejarla vacía. En pantalla da lo mismo. El bloque no tiene una función para "volver a los predeterminados", y los valores quedaron escritos también en datos.ts.
- La carga no corre dentro de una transacción, porque las funciones de los bloques no la ofrecen. Si falla a mitad de camino, la base queda parcialmente cargada; volver a correr db:seed la deja bien, porque primero vacía.
- No corrí db:seed sobre local.db, para no borrar datos que pudiera tener cargados el usuario.
