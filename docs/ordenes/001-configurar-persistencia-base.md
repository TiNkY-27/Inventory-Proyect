# #001 — Configurar la persistencia base

- Estado: hecha
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
  - Existen los scripts db:generate y db:migrate. Su funcionamiento se verifica en #002, porque drizzle-kit no admite un esquema vacío.
  - npm run dev levanta sin errores.
  - local.db y .env están en .gitignore; .env.example documenta DATABASE_URL.

## Notas del constructor

**Qué hice:**
- Instalé drizzle-orm y better-sqlite3 como dependencias, y drizzle-kit y @types/better-sqlite3 como dependencias de desarrollo.
- Agregué los scripts db:generate (drizzle-kit generate) y db:migrate (drizzle-kit migrate).
- drizzle.config.ts en la raíz: dialecto sqlite, esquema en src/lib/server/*/tablas.ts, migraciones en drizzle/, URL tomada de DATABASE_URL.
- src/lib/server/db/index.ts: crea la conexión una sola vez (a nivel de módulo), activa la verificación de claves foráneas y exporta db. Lee DATABASE_URL con $env/dynamic/private de SvelteKit.
- .env.example documenta DATABASE_URL=local.db. En .gitignore agregué local.db y local.db-* (los archivos auxiliares de SQLite). .env ya estaba ignorado por la plantilla. drizzle/ no se ignora.

**Verificación:**
- npm install: sin errores.
- npm run check: 0 errores, 0 advertencias.
- npm run dev: levanta y "/" responde 200.
- git check-ignore confirma que local.db y .env se ignoran y que .env.example no.
- Verificación de claves foráneas: la instrucción usada deja foreign_keys = 1 (probado con better-sqlite3 aparte; la conexión todavía no se usa en ninguna parte de la app).
- npm run db:generate: FALLA. Ver "Bloqueo".

**Bloqueo:** drizzle-kit corta con error ("No schema files found for path config") si el patrón del esquema no encuentra ningún archivo. Lo confirmé en su código: no tiene opción para aceptar un esquema vacío. Como la orden prohíbe crear tablas y bloques, hoy no existe ningún tablas.ts, y el criterio "db:generate corre sin error (sin cambios)" no se puede cumplir tal como está. Alternativas (no apliqué ninguna):
- A) Aceptar que db:generate falle hasta que exista el primer bloque. Con catalogo/tablas.ts (#002) ya funciona. No agrega archivos.
- B) Crear un tablas.ts vacío en src/lib/server/db/ para que el patrón encuentre algo. Contradice que tablas.ts sea propio de cada bloque (D-003) y deja un archivo sin función.
- C) Cambiar el patrón del esquema para que incluya otro archivo. Contradice la restricción de la orden.

**Desvíos y observaciones:**
- drizzle-kit no lee .env por su cuenta. drizzle.config.ts lo carga con process.loadEnvFile() de Node si el archivo existe, sin dependencias nuevas. Si DATABASE_URL tampoco está en el entorno, falla con un mensaje claro.
- Para probar, creé un .env local copiando .env.example (no se versiona). npm run db:migrate creó un local.db vacío (ignorado).
- npm run db:migrate hoy termina con código 1 y sin mensaje, porque todavía no hay carpeta drizzle/ con migraciones. No es un criterio de esta orden. Debería andar cuando #002 genere la primera migración.
- db/index.ts usa $env/dynamic/private, que solo existe dentro de SvelteKit/Vite. Esto afecta a #005: un script de semilla ejecutado fuera de SvelteKit no podría importar los bloques tal como están (esa orden ya prevé bloquearse en ese caso).
- npm 11 no ejecutó los scripts de instalación de better-sqlite3 ni de esbuild (política allowScripts). No hizo falta: better-sqlite3 13 trae binarios precompilados y drizzle-kit funciona igual.
- npm audit informa 7 vulnerabilidades (3 bajas, 4 moderadas) en dependencias de desarrollo. No hice npm audit fix para no cambiar versiones fuera del alcance.

**Resolución del bloqueo:** el usuario corrigió el criterio de terminado: ahora alcanza con que existan los scripts db:generate y db:migrate, y su funcionamiento se verifica en #002. No hizo falta cambiar el código. Volví a verificar: npm install y npm run check sin errores, los dos scripts existen, local.db y .env se ignoran y .env.example documenta DATABASE_URL. npm run dev ya estaba verificado y no hubo cambios desde entonces.
