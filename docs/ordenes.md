# Registro de órdenes

Formato y estados: ver formato-ordenes.md. Las órdenes más nuevas van al final.
## #000 — Relevar estado inicial del proyecto
Estado: hecha
Decisión origen: ninguna
Objetivo: documentar lo que ya existe (construido antes del sistema de órdenes) para que diseño pueda evaluarlo.
Alcance: solo lectura del proyecto. Lo único que se modifica es la sección "Notas del constructor" de esta orden. NO tocar código, carpetas ni configuración.
Restricciones: describir, no evaluar ni proponer cambios. Sin fragmentos de código.
Terminado cuando: las notas describen stack y dependencias principales, estructura de carpetas, qué hace cada archivo/módulo relevante de src/ y static/, cómo se relacionan entre sí, y qué funcionalidades existen hoy (completas o a medias).
Notas del constructor:
- Qué hice: relevamiento de solo lectura de todos los archivos del proyecto (excepto node_modules y .svelte-kit, que son generados). No se tocó código, carpetas ni configuración. Además de las notas se cambió la línea "Estado" (en curso → hecha), como pide CLAUDE.md.
- Resumen: el proyecto es el esqueleto recién generado por el CLI oficial de Svelte (sv 0.17.1, plantilla "minimal", TypeScript, npm) con Tailwind agregado. No hay código propio de la aplicación ni funcionalidad de inventario todavía.
- Stack:
  - Node 24 (.nvmrc apunta a "lts/*"; la versión instalada es v24.21.0). .npmrc activa engine-strict.
  - SvelteKit 2 (instalado 2.70.3) sobre Svelte 5 (5.57.1), con modo runes forzado para todo el código propio (configurado en vite.config.ts).
  - Vite 8 (8.3.1) como bundler/servidor de desarrollo.
  - TypeScript 6 (6.0.3) en modo strict; tsconfig.json extiende el generado por SvelteKit en .svelte-kit/.
  - Tailwind CSS 4 (4.3.3) integrado vía el plugin @tailwindcss/vite (sin archivo tailwind.config; la configuración es por CSS).
  - @sveltejs/adapter-auto 7 como adaptador de despliegue (no hay destino de despliegue elegido).
  - svelte-check para chequeo de tipos.
  - Todas las dependencias son devDependencies; no hay dependencias de runtime, ni base de datos, ORM, librería de UI, autenticación, tests ni linter/formatter.
- Scripts de package.json: dev (servidor de desarrollo), build, preview, prepare (svelte-kit sync), check y check:watch (svelte-check).
- Estructura de carpetas:
  - raíz: package.json, package-lock.json, .npmrc, .nvmrc, .gitignore, tsconfig.json, vite.config.ts, README.md (el README por defecto del CLI de Svelte, en inglés), CLAUDE.md.
  - docs/: registros del sistema de órdenes y decisiones (ordenes.md, decisiones.md —vacío—, formato-ordenes.md, formato-decisiones.md).
  - src/: código de la app (ver abajo).
  - static/: archivos servidos tal cual en la raíz del sitio.
  - .vscode/: recomienda las extensiones de Svelte y Tailwind y asocia los .css al modo Tailwind.
  - node_modules/ y .svelte-kit/: generados, ignorados por git.
- Archivos de src/:
  - src/app.html: plantilla HTML base de SvelteKit (idioma "en", viewport, precarga de datos al pasar el mouse por los enlaces). Contiene los marcadores donde SvelteKit inyecta head y body.
  - src/app.d.ts: declaración de tipos globales de SvelteKit (namespace App) con todas las interfaces comentadas; sin tipos propios.
  - src/lib/index.ts: punto de entrada del alias $lib; solo tiene el comentario por defecto, no exporta nada.
  - src/lib/assets/favicon.svg: logo de Svelte usado como favicon.
  - src/routes/+layout.svelte: layout raíz aplicado a todas las páginas; importa layout.css, agrega el favicon al head y renderiza la página hija.
  - src/routes/layout.css: hoja de estilos global; solo importa Tailwind.
  - src/routes/+page.svelte: página de inicio (ruta "/"); muestra el texto de bienvenida por defecto de SvelteKit con un enlace a su documentación.
- Archivos de static/:
  - static/robots.txt: permite el rastreo de todo el sitio.
- Relaciones: vite.config.ts registra los plugins de Tailwind y SvelteKit (y el adaptador). SvelteKit usa app.html como plantilla, dentro monta +layout.svelte, que carga layout.css (Tailwind) y el favicon desde $lib/assets, y renderiza +page.svelte para la ruta "/". static/ se sirve directamente. src/lib/index.ts y app.d.ts no son usados por ningún otro archivo más allá de la infraestructura de SvelteKit.
- Funcionalidades existentes: ninguna propia, ni completa ni a medias. Solo existe la ruta "/" con la página de bienvenida de la plantilla. No hay otras rutas, endpoints de servidor, hooks, stores, componentes, modelos de datos ni persistencia.
- Desvíos/problemas: ninguno. Observación descriptiva: package.json declara rangos mínimos (p. ej. SvelteKit ^2.63.0, Vite ^8.0.16) y lo instalado según package-lock/node_modules son versiones más nuevas dentro de esos rangos; arriba se listan las instaladas.

<!-- Primera orden: ## #001 — ... -->
