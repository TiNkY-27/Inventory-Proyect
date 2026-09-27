# #007 — Independizar la conexión de SvelteKit

- Estado: pendiente
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
