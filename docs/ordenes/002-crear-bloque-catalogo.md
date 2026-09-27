# #002 — Crear el bloque Catálogo

- Estado: hecha
- Decisión origen: D-001, D-003
- Objetivo: poder dar de alta, editar, listar y eliminar productos.
- Alcance: src/lib/server/catalogo/ (tablas.ts, index.ts), la migración generada, src/routes/productos/ (listado y alta) y src/routes/productos/[id]/ (edición). En src/routes/+layout.svelte, solo agregar un menú con enlaces a Inicio y Productos. NO tocar la página "/" ni crear otros bloques.
- Restricciones:
  - Producto: id (entero autoincremental), nombre (obligatorio, sin espacios sobrantes, no vacío), marca (texto libre, opcional), categoría (texto libre, opcional).
  - index.ts expone: crear, editar, eliminar, obtener por id, listar todos (ordenados por nombre) y la tabla.
  - Si la base rechaza una eliminación, la pantalla muestra "No se puede eliminar: está en uso" en lugar de un error.
  - Estilos con Tailwind, sin librerías de componentes. Textos de la interfaz en español.
- Terminado cuando:
  - npm run check sin errores. La migración se genera y se aplica con db:migrate.
  - Desde /productos se puede crear, editar y eliminar un producto.
  - Un producto sin nombre se rechaza con un mensaje visible.
  - El menú aparece en todas las páginas.
  - Nada fuera de catalogo/ importa su tablas.ts.

## Notas del constructor

**Qué hice:**
- src/lib/server/catalogo/tablas.ts: tabla productos con id (entero autoincremental), nombre (obligatorio), marca y categoria (opcionales).
- src/lib/server/catalogo/index.ts: expone crear, editar, eliminar, obtenerPorId, listarTodos y la tabla productos. La validación está en el bloque: el nombre se recorta y no puede quedar vacío. crear, editar y eliminar devuelven un resultado { ok, valor } o { ok: false, error } en lugar de lanzar excepciones, y la pantalla muestra el error. No importa módulos de SvelteKit (D-004); usa el alias $lib para la conexión.
- Migración drizzle/0000_vengeful_karnak.sql (nombre generado por drizzle-kit), aplicada con db:migrate sobre local.db.
- src/routes/productos/: listado con alta (acción crear) y eliminación por fila (acción eliminar, con confirmación en el navegador). src/routes/productos/[id]/: edición; al guardar vuelve a /productos. Un id inexistente o no numérico da 404.
- src/routes/+layout.svelte: solo agregué el menú con Inicio y Productos.
- Formularios con use:enhance. Sin JavaScript también funcionan, y ante un error se conservan los valores cargados.

**Verificación:**
- npm run db:generate y npm run db:migrate funcionan (esto también cubre lo que #001 dejó pendiente de verificar).
- npm run check: 0 errores, 0 advertencias.
- Pruebas contra el servidor dev con una base temporal (fuera del proyecto), simulando un navegador sin JavaScript:
  - Alta: "  Martillo  " se guarda como "Martillo", y una categoría con solo espacios queda vacía (null).
  - Sin nombre: responde 400 con "El nombre es obligatorio." y conserva los otros valores.
  - Edición: guarda y redirige (303). Con el nombre vacío se rechaza con el mensaje y no se guarda.
  - /productos/999 y /productos/abc responden 404.
  - Eliminación: un producto libre se elimina. Para probar el rechazo, agregué a la base temporal una tabla que referencia a productos (todavía no existe stock): responde 409 con "No se puede eliminar: está en uso". También lo probé en la variante JSON que usa use:enhance.
  - El orden no distingue mayúsculas: arandela, Martillo, Zapato.
  - El menú aparece en /, /productos y /productos/1.
- grep: nada fuera de catalogo/ importa su tablas.ts, y no hay imports de $env ni $app en src/lib/server/.

**Desvíos y observaciones:**
- Además de lo que pide la orden, index.ts exporta tipos (Producto, DatosProducto, Resultado) que usan las pantallas. No son funciones nuevas.
- Marca y categoría también se recortan, y si quedan vacías se guardan como null (sin valor) en lugar de texto vacío.
- "Ordenados por nombre" lo implementé como lower(nombre), para que las mayúsculas no alteren el orden (lower es SQL estándar). Los acentos no se normalizan.
- El rechazo por referencia se detecta con el código de error de SQLite (SQLITE_CONSTRAINT_FOREIGNKEY) dentro de catalogo/index.ts. Al migrar a PostgreSQL, eso también habrá que cambiarlo, no solo db/ y tablas.ts como dice D-003. Una alternativa sería una función compartida en db/ que reconozca ese error, pero db/ no estaba en el alcance.
- El texto "No se puede eliminar: está en uso" lo arma el bloque y la pantalla lo muestra tal cual.
- Para no tocar el layout más allá del menú, el margen y ancho del contenido de las páginas de productos se aplica en cada página. La página "/" sigue sin estilos.
- src/app.html sigue con lang="en" aunque la interfaz esté en español. Está fuera del alcance.
