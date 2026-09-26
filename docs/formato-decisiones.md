# Formato de decisiones

Cada decisión es un archivo en `docs/decisiones/`.

## Nombre de archivo

`D-NNN-titulo-corto.md` (número de 3 dígitos, título en minúsculas con guiones).
Ejemplo: `D-001-stack-del-proyecto.md`

## Plantilla

```
# D-NNN — Título corto

- Estado: vigente
- Contexto: qué problema o pregunta había.
- Decisión: qué se eligió.
- Descartado: alternativas consideradas y por qué no.
- Consecuencias: qué implica o condiciona hacia adelante.
```

## Estados

- `vigente`: aplica actualmente.
- `reemplazada por D-NNN`: ya no aplica; se mantiene como historial.

## Índice

`docs/decisiones/INDICE.md` tiene una fila por decisión: número (con enlace al archivo), título y estado.

## Reglas

- Numeración correlativa. Nunca se reutiliza.
- Solo se registran decisiones cerradas y confirmadas por el usuario.
- Las decisiones no se borran: se reemplazan.
- Al crear una decisión o cambiar su estado, se actualiza el archivo **y** su fila en el índice.
- Una decisión vigente no se reabre sin un motivo nuevo explícito.
- Las órdenes que surgen de una decisión la citan en "Decisión origen".
