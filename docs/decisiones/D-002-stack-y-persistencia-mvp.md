# D-002 — Stack y persistencia del MVP

- Estado: vigente
- Contexto: el stack vino de la plantilla de SvelteKit sin decisión registrada, y el MVP necesita guardar datos.
- Decisión: se mantiene el stack existente (SvelteKit 2, Svelte 5 con runes, TypeScript strict, Tailwind 4, npm). La persistencia es SQLite con Drizzle ORM, usando las migraciones de Drizzle. El MVP maneja un solo negocio, sin usuarios ni login. Se incluye un conjunto de datos de ejemplo reproducible para probar.
- Descartado: PostgreSQL desde el inicio (exige un servidor ahora y no ayuda a validar el MVP); datos en memoria o JSON (se tiran y no validan el modelo); multi-empresa y login (se deciden al diseñar Acceso y cuenta).
- Consecuencias: está prevista la migración a PostgreSQL. Para que sea acotada, no se usan funciones propias de SQLite y todo el acceso a datos queda dentro de cada bloque. adapter-auto se mantiene hasta decidir el despliegue.
