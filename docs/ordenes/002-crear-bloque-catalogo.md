# #002 — Crear el bloque Catálogo

- Estado: pendiente
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
