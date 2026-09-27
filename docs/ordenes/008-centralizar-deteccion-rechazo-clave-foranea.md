# #008 — Centralizar la detección de rechazo por clave foránea

- Estado: pendiente
- Decisión origen: D-002
- Objetivo: que reconocer el error "está en uso" (rechazo por clave foránea) dependa del motor de base en un solo lugar, para que migrar a PostgreSQL lo cambie una sola vez.
- Alcance: src/lib/server/db/ (agregar la función) y src/lib/server/catalogo/index.ts (usarla en lugar de su detección actual). NO tocar pantallas, tablas ni otros archivos.
- Restricciones:
  - db/ expone una función que recibe un error e indica si es un rechazo por clave foránea. Es el único lugar del proyecto que conoce el código de error de SQLite.
  - catalogo/ deja de mencionar códigos de error de SQLite.
  - El comportamiento de la pantalla no cambia.
  - No importar módulos de SvelteKit (D-004).
- Terminado cuando:
  - npm run check sin errores.
  - Buscar en src/ el código de error de SQLite solo encuentra resultados dentro de db/.
  - Eliminar un producto referenciado sigue mostrando "No se puede eliminar: está en uso". Se verifica igual que en la #002: con una base temporal y una tabla que referencie a productos.

## Notas del constructor
