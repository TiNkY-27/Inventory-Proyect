# Formato de órdenes

Cada orden es un archivo en `docs/ordenes/`. Una tarea por orden.

## Nombre de archivo

`NNN-titulo-corto.md` (número de 3 dígitos, título en minúsculas con guiones).
Ejemplo: `001-crear-modulo-productos.md`

## Plantilla

```
# #NNN — Título corto (verbo + qué)

- Estado: pendiente
- Decisión origen: D-NNN (o "ninguna")
- Objetivo: qué se construye y para qué.
- Alcance: módulos/archivos que toca. Qué NO debe tocar.
- Restricciones: reglas de diseño que debe respetar.
- Terminado cuando: criterios concretos y verificables.

## Notas del constructor

(las completa el constructor al terminar)
```

## Estados

- `pendiente`: diseñada, sin empezar.
- `en curso`: el constructor está trabajando en ella.
- `hecha`: cumple todos los criterios de "Terminado cuando".
- `bloqueada: <motivo>`: no puede avanzar sin una decisión o dato del usuario.
- `cancelada: <motivo>`: no se va a hacer (o fue reemplazada por #NNN).

## Índice

`docs/ordenes/INDICE.md` tiene una fila por orden: número (con enlace al archivo), título y estado.

## Reglas

- Numeración correlativa. Nunca se reutiliza un número.
- Las órdenes no se borran: se cancelan.
- Al crear una orden o cambiar su estado, se actualiza el archivo **y** su fila en el índice. Ambos deben coincidir siempre.
- Si el constructor necesita tomar una decisión de diseño para avanzar, marca la orden como `bloqueada` en vez de decidir.
- "Notas del constructor" registra lo hecho, desvíos respecto a la orden y problemas encontrados.
