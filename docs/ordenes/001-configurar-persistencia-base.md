# #001 — Configurar la persistencia base

- Estado: pendiente
- Decisión origen: D-002, D-003
- Objetivo: dejar SQLite con Drizzle funcionando para que los bloques puedan definir tablas. No se crea ninguna tabla.
- Alcance: package.json (dependencias drizzle-orm, better-sqlite3 y sus tipos, drizzle-kit; scripts nuevos), archivo de configuración de drizzle-kit en la raíz, src/lib/server/db/, .gitignore, .env.example. NO crear tablas, bloques ni rutas. NO tocar src/routes.
- Restricciones:
  - La ruta del archivo de base se toma de la variable de entorno DATABASE_URL. En .env.example se documenta con el valor local.db (archivo en la raíz).
  - local.db y .env no se versionan. La carpeta de migraciones (drizzle/, en la raíz) sí se versiona.
  - drizzle-kit busca las tablas en src/lib/server/*/tablas.ts.
  - Scripts npm: db:generate (genera migraciones) y db:migrate (las aplica).
  - La conexión se crea una sola vez, se exporta desde src/lib/server/db/index.ts y activa la verificación de claves foráneas.
  - No usar funciones exclusivas de SQLite, salvo la activación de claves foráneas.
- Terminado cuando:
  - npm install y npm run check terminan sin errores.
  - npm run db:generate corre sin error (sin cambios, porque no hay tablas).
  - npm run dev levanta sin errores.
  - local.db y .env están en .gitignore; .env.example documenta DATABASE_URL.

## Notas del constructor
