# D-004 — Conexión y bloques independientes de SvelteKit

- Estado: vigente
- Contexto: la conexión creada en #001 lee DATABASE_URL con un módulo propio de SvelteKit, así que ningún código que corra fuera de SvelteKit (el script de datos de ejemplo, futuras herramientas o pruebas) puede usar los bloques.
- Decisión: el código de src/lib/server/db/ y de los bloques no importa módulos propios de SvelteKit ($env, $app ni otros módulos virtuales). El alias $lib sí se permite. La conexión toma DATABASE_URL de las variables de entorno del proceso y, si existe .env, lo carga con la misma función de Node que usa drizzle.config.ts. Los scripts que corren fuera de SvelteKit se ejecutan con tsx.
- Descartado: cargar los datos de ejemplo desde una página de desarrollo (mete herramientas de desarrollo en la app y no resuelve la dependencia); insertar directo en las tablas (saltea las validaciones de los bloques).
- Consecuencias: los bloques se pueden usar desde scripts y futuras pruebas. Las pantallas (src/routes/) sí pueden usar módulos de SvelteKit.
