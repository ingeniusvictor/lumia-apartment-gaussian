# LUMIA AP-03 — Navegación física y colisiones (prototipo)

**Estado:** prototipo validado funcionalmente por el usuario en Chrome/Windows el 2026-11-01, después del refuerzo de los muros de colisión (commit `6835b6c`). Pendiente una batería automatizada de regresión y pruebas con el apartamento definitivo.

## Qué contiene

- Usa la misma escena Gaussian de AP-02: `lumia/scenes/ap02-demo/scene.ply`.
- `lumia/scripts/generate-collision.mjs` genera un **GLB físico no visible** con suelo, 3 paredes, una barrera frontal y cuatro obstáculos simples.
- `lumia/scenes/ap03-navigation/settings.json` sitúa la cámara inicialmente dentro de la sala.
- `lumia/scripts/start-ap03.ps1` prepara los tres recursos requeridos dentro de `public/` (ignorado por Git) y arranca el visor.
- **No modifica PlayCanvas**, la rama `main` ni la base `research/ap02-gaussian-baseline`.

La malla no coincide con precisión centimétrica con los muebles de la escena de ejemplo. Es para evaluar el controlador de cámara y la física antes de construir el apartamento real.

## Ejecución en Windows

Detener cualquier servidor AP-02 que ocupe el puerto 3000 con `Ctrl+C`. Desde el repositorio local:

```powershell
git fetch origin
git switch --track origin/feat/ap03-walk-collision-prototype
Set-ExecutionPolicy -Scope Process Bypass -Force
.\lumia\scripts\start-ap03.ps1
```

Abrir exactamente:

```text
http://127.0.0.1:3000/?content=scene.ply&settings=lumia-ap03-settings.json&collision=lumia-ap03-collision.glb&webgl&lang=es
```

Si falla `git switch --track` porque la rama ya existe localmente, usar `git switch feat/ap03-walk-collision-prototype` y `git pull --ff-only`.

## Controles y pruebas

1. La sala debe abrir con la cámara **dentro** de la habitación; si no, revisar la URL.
2. Tras cargar, usar `3` o el icono de caminar para activar **Walk**; `G` conmuta controles de juego.
3. Con los controles de juego activos, probar `W A S D` y ratón.
4. Probar que el suelo mantiene altura, las paredes limitan movimiento y la mesa interrumpe el paso.
5. `V` conmuta la superposición de colisiones (si el visor la habilita).
6. Para verificar que el servidor entrega los archivos, desde otra terminal:

```powershell
curl.exe -I http://127.0.0.1:3000/scene.ply
curl.exe -I http://127.0.0.1:3000/lumia-ap03-settings.json
curl.exe -I http://127.0.0.1:3000/lumia-ap03-collision.glb
```

Se esperan tres respuestas HTTP 200. HTTP 200 **no garantiza** que la física esté correctamente cargada: la prueba decisiva es entrar a Walk y confirmar las colisiones. Si no aparece Walk, abrir consola Chrome F12 y buscar `Failed to load mesh collision`.

## Condiciones de aceptación

- Los recursos se sirven sin 404 y el visor sigue renderizando.
- El modo Walk se habilita al terminar la carga de la malla.
- La cámara se desplaza sin atravesar paredes ni caer fuera del suelo.
- AP-02 continúa iniciando con `lumia/scripts/start-ap02.ps1` al volver a su rama.

**Fuera de alcance AP-03 inicial:** puertas animadas, avatar de LUMIA, modelo real del apartamento, escaneo fotográfico o precisión de colisiones del mobiliario. Se abordarán solo después de validar esta prueba.

## Evidencia de validación manual (2026-11-01)

- El usuario confirmó que el mueble no se atraviesa, pero detectó que las paredes exteriores sí se atravesaban en la versión inicial.
- Se aumentó el espesor de muros a 0,60 m, se reforzaron los límites y el suelo y se solaparon las esquinas en `6835b6c`.
- Tras actualizar el generador y reiniciar AP-03, el usuario respondió **«FUNCIONA»**. Se registra como **PASS reportado por el usuario para la corrección de colisiones**; no se atribuye una auditoría exhaustiva de cada superficie ni una prueba automatizada.
- Conservamos `main` y `research/ap02-gaussian-baseline` sin incorporar estos cambios experimentales.

## Próxima etapa sugerida: AP-04

Puerta interactiva independiente de la geometría Gaussian, con estado de apertura/cierre, animación y actualización de barrera de navegación. Preparar posteriormente las rutas del avatar LUMIA. No integrar aún el GLB final ni modificar los archivos de cuerpo/rostro originales.
