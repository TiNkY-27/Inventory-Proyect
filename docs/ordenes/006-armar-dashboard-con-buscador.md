# #006 — Armar el dashboard con buscador

- Estado: hecha
- Decisión origen: D-001, D-003
- Objetivo: que la página principal permita buscar un producto y ver dónde está y cuánto hay.
- Alcance: src/routes/+page.svelte y su load (reemplaza la bienvenida de la plantilla). En catalogo/, agregar la función de búsqueda. En stock/, agregar la función que obtiene el stock de varios productos a la vez. NO otros cambios en los bloques.
- Restricciones:
  - La búsqueda es por texto, con coincidencia parcial sobre nombre, marca o categoría y sin distinguir mayúsculas. Los acentos no se normalizan. Devuelve como máximo 50 resultados, ordenados por nombre.
  - El texto buscado va en la URL (?q=). La búsqueda se ejecuta al enviar, no mientras se escribe. Sin texto, solo se muestra el buscador.
  - Cada resultado muestra nombre, marca, categoría, stock total y cada ubicación (con su ruta) con su cantidad, o "Sin stock" si no tiene. Además, enlaza a la ficha.
  - La página combina los datos: Catálogo busca y Stock trae las cantidades de todos los resultados en una sola consulta, no una por producto. Catálogo no llama a Stock.
- Terminado cuando:
  - npm run check sin errores.
  - Con los datos de ejemplo, buscar una marca devuelve sus productos, y la misma búsqueda en mayúsculas da el mismo resultado.
  - Un producto en dos estantes muestra ambos.
  - Una búsqueda sin resultados muestra un mensaje.
  - Recargar la página con ?q= conserva la búsqueda.

## Notas del constructor

**Qué hice:**
- catalogo/index.ts: agregué buscar(texto).
  - Recorta el texto; si queda vacío, no devuelve nada.
  - Coincidencia parcial en nombre, marca o categoría con lower(...) LIKE, hasta 50 resultados, ordenados por nombre como listarTodos.
  - % y _ se escapan (ESCAPE, SQL estándar) para que se busquen como texto.
  - Catálogo no usa Stock.
- stock/index.ts: agregué obtenerStockDeProductos(ids). Hace una sola consulta a la tabla de stock para todos los ids (inArray) y una a Ubicaciones (listarNivel3) para las rutas. Devuelve un Map con una entrada por id pedido; sin stock, la lista queda vacía y el total en 0. Las ubicaciones salen ordenadas por ruta, igual que en obtenerStockDeProducto.
- Salvo por ampliar dos imports, no cambié nada existente en los bloques: solo agregué esas dos funciones.
- src/routes/+page.server.ts (nuevo): el load lee ?q=, busca con Catálogo, pide el stock de todos los resultados a Stock y combina los datos. Sin texto, no busca.
- src/routes/+page.svelte: reemplaza la bienvenida de la plantilla.
  - Buscador con un formulario GET, que pone el texto en la URL y busca solo al enviar.
  - Cada resultado muestra nombre (con enlace a la ficha), marca y categoría, el total y cada ubicación con su ruta y cantidad, o "Sin stock".
  - Sin resultados, dice "No se encontraron productos para «…»". Si llega a 50, avisa que se muestran los primeros 50.

**Verificación:** servidor dev sobre una copia de una base temporal con los datos de ejemplo (#005).
- npm run check: 0 errores, 0 advertencias.
- "stanley" y "STANLEY" devuelven los mismos 4 productos, ordenados por nombre. "Bosch" devuelve sus 4 productos.
- También se encuentra por categoría ("fijac" → 6 fijaciones) y por parte del nombre ("1/4" → arandelas y bulones).
- El martillo muestra sus dos estantes (12 y 6) con total 18 y enlaza a su ficha. La sierra caladora muestra "Sin stock" con total 0.
- "zzz" muestra el mensaje de sin resultados. "%" y "_" no devuelven todo: se buscan como texto.
- "latex" no encuentra «Látex» (los acentos no se normalizan). "LÁTEX" sí lo encuentra.
- Sin ?q= solo aparece el buscador. Con ?q=bahco la página cargada directamente conserva el texto en el campo y muestra los resultados. Los espacios alrededor se recortan.
- Límite: con 60 productos que coinciden, devuelve 50 ("Remache 01" a "Remache 50") y la pantalla muestra el aviso.

**Observaciones:**
- Mayúsculas y acentos: el texto buscado se pasa a minúsculas en JavaScript (que convierte bien las letras acentuadas) y se compara con lower(columna) en la base. En SQLite, lower() solo convierte letras sin acento. Por eso, un dato guardado con mayúscula acentuada (por ejemplo "ÁRBOL") no se encontraría escribiendo "árbol". Con los datos actuales no pasa, y en PostgreSQL lower() convierte todo.
- El 50 aparece en dos lugares: en catalogo (MAXIMO_RESULTADOS) y en la pantalla, para mostrar el aviso. Si cambia el máximo, hay que cambiar los dos.
- "Una sola consulta" se cumple por construcción (una consulta a stock para todos los resultados, más la lista de estantes de Ubicaciones). No lo medí con un registro de consultas.
