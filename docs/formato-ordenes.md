# Formato de órdenes

Toda orden para el constructor sigue esta plantilla. Una tarea por orden.

```
## #NNN — Título corto (verbo + qué)
Estado: pendiente
Decisión origen: D-NNN (o "ninguna")
Objetivo: qué se construye y para qué.
Alcance: módulos/archivos que toca. Qué NO debe tocar.
Restricciones: reglas de diseño que debe respetar.
Terminado cuando: criterios concretos y verificables.
Notas del constructor: (las completa el constructor al terminar)
```

## Estados

- `pendiente`: diseñada, sin empezar.
- `en curso`: el constructor está trabajando en ella.
- `hecha`: cumple todos los criterios de "Terminado cuando".
- `bloqueada: <motivo>`: no puede avanzar sin una decisión o dato del usuario.
- `cancelada: <motivo>`: no se va a hacer (o fue reemplazada por #NNN).

## Reglas

- Numeración correlativa (#001, #002...). Nunca se reutiliza un número.
- Las órdenes no se borran: se cancelan.
- Si el constructor necesita tomar una decisión de diseño para avanzar, marca la orden como `bloqueada` en vez de decidir.
- "Notas del constructor" registra lo hecho, desvíos respecto a la orden y problemas encontrados.
