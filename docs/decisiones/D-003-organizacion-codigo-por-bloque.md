# D-003 — Organización del código por bloque

- Estado: vigente
- Contexto: los bloques de D-001 necesitan un lugar fijo en el código, para que se respeten sus fronteras y cada orden no lo resuelva distinto.
- Decisión: cada bloque vive en src/lib/server/<bloque>/ (catalogo, ubicaciones, stock). Sus tablas van en tablas.ts y su única entrada pública es index.ts, que expone las funciones del bloque y su tabla (esta última solo para definir relaciones). La conexión compartida vive en src/lib/server/db/. Las validaciones de datos se hacen dentro del bloque, no en las pantallas. Las pantallas viven en src/routes/, leen datos con load de servidor y los modifican con form actions; no hay endpoints de API en el MVP. Reglas de dependencia: ningún bloque importa el interior de otro, solo su index.ts; solo stock usa a catalogo y ubicaciones; ningún bloque importa rutas.
- Descartado: organización por tipo técnico (dispersa los bloques y no impide dependencias indebidas); endpoints de API (no hacen falta sin clientes externos).
- Consecuencias: migrar a PostgreSQL toca db/ y los tablas.ts. Cuando una pantalla necesita datos de varios bloques, los combina la pantalla, no un bloque.
