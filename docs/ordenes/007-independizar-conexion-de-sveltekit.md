# #007 — Independizar la conexión de SvelteKit

- Estado: hecha
- Decisión origen: D-004
- Objetivo: que la conexión a la base funcione tanto dentro como fuera de SvelteKit.
- Alcance: src/lib/server/db/index.ts. NO tocar drizzle.config.ts, package.json, rutas ni ningún otro archivo.
- Restricciones:
  - No importar módulos propios de SvelteKit.
  - DATABASE_URL se toma de las variables de entorno del proceso. Si existe un archivo .env en la raíz, se carga con la misma función de Node que usa drizzle.config.ts.
  - Si DATABASE_URL no está definida, la conexión falla con un mensaje que lo diga explícitamente.
  - Se mantienen la creación única de la conexión y la activación de claves foráneas.
- Terminado cuando:
  - npm run check sin errores y npm run dev levanta.
  - src/lib/server/db/ no contiene imports de $env ni de $app.
  - Un script temporal, ejecutado con Node fuera de SvelteKit, obtiene la conexión y ejecuta una consulta trivial sin errores. El script se borra al terminar y se describe en las notas.
  - Sin .env y sin la variable definida, aparece el mensaje explícito.

## Notas del constructor

**Qué hice:**
- En src/lib/server/db/index.ts reemplacé el import de $env/dynamic/private por process.env. Si existe .env, se carga antes con process.loadEnvFile(), la misma función que usa drizzle.config.ts. Si DATABASE_URL no está definida, falla con "DATABASE_URL no está definida".
- Se mantienen la conexión única (a nivel de módulo) y la activación de claves foráneas. No toqué ningún otro archivo.

**Verificación:**
- npm run check: 0 errores, 0 advertencias. npm run dev levanta y "/" responde 200.
- grep de "$env" y "$app" en src/lib/server/db/: sin resultados.
- Script temporal verificar-conexion.tmp.ts en la raíz: importaba db desde src/lib/server/db/index.ts, ejecutaba select 1 con drizzle y leía el pragma foreign_keys. Lo corrí con Node 24, que ejecuta TypeScript sin herramientas extra (sin tsx, que todavía no está instalado). Resultados:
  - Desde la raíz, con .env: consulta { uno: 1 } y foreign_keys 1, sin errores.
  - Desde una carpeta sin .env y sin la variable: "Error: DATABASE_URL no está definida", código de salida 1.
  - Desde una carpeta sin .env pero con DATABASE_URL=:memory: en el entorno: funciona.
  - Al terminar, borré el script.

**Observaciones:**
- ".env en la raíz" se resuelve respecto del directorio de trabajo del proceso, igual que en drizzle.config.ts. Los scripts npm siempre corren desde la raíz, pero un proceso lanzado desde otra carpeta no encontraría el .env y dependería de la variable del entorno.
- process.loadEnvFile() no pisa variables ya definidas en el entorno: una DATABASE_URL del entorno tiene prioridad sobre la de .env.
- Dentro de SvelteKit solo verifiqué que dev levante, porque ninguna pantalla usa la conexión todavía. El primer uso real dentro de la app va a ser en #002.
