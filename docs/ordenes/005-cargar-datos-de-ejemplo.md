# #005 — Cargar datos de ejemplo

- Estado: pendiente
- Decisión origen: D-002
- Objetivo: tener un conjunto de datos fijo y reproducible para probar el MVP y, más adelante, verificar la migración a PostgreSQL.
- Alcance: un script ejecutable con npm run db:seed, y sus datos en un archivo separado de la lógica de carga. NO modificar bloques ni pantallas.
- Restricciones:
  - Rubro: ferretería.
  - Antes de cargar, vacía todas las tablas. Los datos son fijos, no aleatorios.
  - Carga los datos usando las funciones de los bloques, sin insertar en las tablas directamente. Si ejecutar el script fuera de SvelteKit impide usar los bloques, marcar la orden como bloqueada en lugar de resolverlo de otra forma.
  - Contenido: nombres de nivel predeterminados; 2 pasillos, cada uno con 3 estanterías de 3 estantes; unos 30 productos, con al menos 6 marcas y 5 categorías, y algunos sin marca; al menos 5 productos en 2 o más estantes; al menos 3 productos sin stock.
  - Es solo para desarrollo: no se ejecuta automáticamente.
- Terminado cuando:
  - npm run db:seed sobre una base migrada carga todo sin errores.
  - Ejecutarlo dos veces deja exactamente el mismo resultado, sin duplicados.
  - Los datos se ven en /productos, en /ubicaciones y en las fichas.

## Notas del constructor
