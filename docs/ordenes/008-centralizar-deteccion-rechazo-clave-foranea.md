# #008 — Centralizar la detección de rechazo por clave foránea

- Estado: hecha
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

**Qué hice:**
- En src/lib/server/db/index.ts agregué esRechazoPorClaveForanea(e), que indica si un error es un rechazo por clave foránea. Ahí está el único uso del código SQLITE_CONSTRAINT_FOREIGNKEY.
- En src/lib/server/catalogo/index.ts saqué su función propia de detección, y eliminar ahora usa la de db/. No cambió nada más.

**Verificación:**
- npm run check: 0 errores, 0 advertencias.
- grep "SQLITE_" en src/: un solo resultado, en src/lib/server/db/index.ts.
- Sin imports de $env ni $app en src/lib/server/ (D-004).
- Igual que en #002: base temporal fuera del proyecto, con una tabla que referencia a productos y el servidor dev apuntando a esa base.
  - Eliminar un producto referenciado responde 409 con "No se puede eliminar: está en uso", tanto sin JavaScript como con use:enhance (JSON).
  - Eliminar un producto libre funciona.
  - El log de dev no muestra errores.

**Observaciones:**
- La función quedó en db/index.ts, junto a la conexión, en lugar de en un archivo aparte. Así se importa desde el mismo lugar que db.
