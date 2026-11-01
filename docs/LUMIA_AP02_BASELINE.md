# LUMIA AP-02 â€” Gaussian Splatting (baseline de investigacion)

Fecha de preparacion (UTC): 2026-11-01 04:11:18

- Proyecto propio: ingeniusvictor/lumia-apartment-gaussian
- Rama de trabajo: research/ap02-gaussian-baseline
- Fuente del visor: https://github.com/playcanvas/supersplat-viewer.git
- Commit original al clonar: 027e8fe27214f42b9a7fbc66dbe993fe107990a4
- Editor externo: https://github.com/playcanvas/supersplat.git
- Licencia: MIT; conservar LICENSE y avisos de copyright.

## Objetivo

Utilizar SuperSplat Viewer como plataforma de exploracion fotorealista de un apartamento
cuya escena haya sido capturada o generada de manera autorizada. Una futura capa de
PlayCanvas controlara a LUMIA (avatar GLB, animaciones, puertas, sillas y colisiones).

## Limites de esta etapa

- No se ha escaneado ni convertido ningun apartamento.
- No se ha importado el modelo GLB de LUMIA.
- No se han agregado puertas interactivas ni animaciones.
- El clon del editor permanece separado en ../tooling/supersplat-editor.
- No modificar LUMIA MOTION ni lumia-apartment-matterport.
- No publicar modelos, planos o fotografias residenciales sin autorizacion.

## Inicio local

    npm ci
    npm run develop

Abrir http://localhost:3000. Requiere Node.js 20 o superior.
Para un splat propio, usar un formato admitido por el visor (por ejemplo .sog / .ply),
configurar content, settings y, para caminata fisica, collision.

Referencias:
- https://github.com/playcanvas/supersplat-viewer
- https://github.com/playcanvas/supersplat
- https://developer.playcanvas.com/user-manual/supersplat/viewer/