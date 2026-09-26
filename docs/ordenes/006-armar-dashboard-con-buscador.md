# #006 — Armar el dashboard con buscador

- Estado: pendiente
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
