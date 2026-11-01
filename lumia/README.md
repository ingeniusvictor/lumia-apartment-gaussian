# LUMIA AP-02 — Gaussian Splatting (baseline)

Este directorio contiene la primera **escena de prueba** de LUMIA para el visor [SuperSplat Viewer](https://github.com/playcanvas/supersplat-viewer), bajo su licencia MIT y avisos de terceros.

## Estado

- Rama de trabajo: `research/ap02-gaussian-baseline`.
- Escena de prueba: `lumia/scenes/ap02-demo/scene.ply`.
- Configuracion compatible: `lumia/scenes/ap02-demo/settings.json`.
- Primera visualizacion validada manualmente en Chrome/WebGL con la URL de abajo.
- **No** es una reconstruccion del apartamento real ni integra aun a LUMIA MOTION.

## Inicio reproducible — Windows PowerShell 5.1

Requisitos: Node.js 20+, npm y Git.

Desde la raiz del repositorio:

```powershell
Set-ExecutionPolicy -Scope Process Bypass -Force
.\lumia\scripts\start-ap02.ps1
```

El iniciador instala dependencias con `npm ci` si hace falta, copia la escena versionada a `public/` (carpeta excluida por el `.gitignore` original) e inicia `npm run develop`.

Abrir en Chrome:

```text
http://127.0.0.1:3000/?content=scene.ply&webgl&lang=es
```

La ventana de PowerShell debe permanecer abierta mientras se usa el visor. Detener con Ctrl+C.

Para forzar reinstalacion de dependencias:

```powershell
.\lumia\scripts\start-ap02.ps1 -Reinstall
```

## Verificacion rapida

Desde otra consola, mientras esta activo el servidor:

```powershell
curl.exe -I http://127.0.0.1:3000/scene.ply
curl.exe -I http://127.0.0.1:3000/settings.json
```

Ambos deben devolver HTTP 200. Si la pagina no renderiza aun con HTTP 200, revisar la consola de Chrome (F12) y confirmar que se abre la URL con `content=scene.ply&webgl`.

## Arquitectura futura

AP-03 evaluara la navegacion y colisiones sobre una malla independiente, interaccion con objetos y futura integracion del avatar GLB de LUMIA. Los datos de Gaussian Splatting son principalmente la **capa visual**: no sustituyen la malla fisica ni las animaciones de puertas y muebles.

Conservar fuentes autorizadas, licencias y avisos. No subir al repositorio publico planos, imagenes privadas, contraseñas ni material Matterport sin permiso apropiado.
