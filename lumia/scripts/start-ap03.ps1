# LUMIA AP-03 - navigation prototype, Windows PowerShell 5.1
# Run from the repository root:
#   Set-ExecutionPolicy -Scope Process Bypass -Force
#   .\lumia\scripts\start-ap03.ps1
param([switch]$Reinstall)

$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$scene = Join-Path $root 'lumia\scenes\ap02-demo\scene.ply'
$settings = Join-Path $root 'lumia\scenes\ap03-navigation\settings.json'
$generator = Join-Path $PSScriptRoot 'generate-collision.mjs'
$publicDir = Join-Path $root 'public'
foreach ($file in @($scene, $settings, $generator)) {
    if (-not (Test-Path $file -PathType Leaf)) {
        throw "AP-03: archivo requerido no encontrado: $file"
    }
}
if (-not (Get-Command node.exe -ErrorAction SilentlyContinue)) {
    throw 'AP-03 requiere Node.js 20 o superior.'
}
if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    throw 'AP-03 requiere npm.'
}
Push-Location $root
try {
    if ($Reinstall -or -not (Test-Path 'node_modules')) {
        Write-Host '[AP-03] Instalando dependencias...' -ForegroundColor Cyan
        & npm.cmd ci
        if ($LASTEXITCODE -ne 0) { throw 'npm ci fallo' }
    }
    New-Item -ItemType Directory -Force -Path $publicDir | Out-Null
    Copy-Item $scene (Join-Path $publicDir 'scene.ply') -Force
    Copy-Item $settings (Join-Path $publicDir 'lumia-ap03-settings.json') -Force
    & node.exe $generator
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo generar GLB de colisiones' }
    if (-not (Test-Path (Join-Path $publicDir 'lumia-ap03-collision.glb'))) {
        throw 'Falta el GLB de colisiones tras generacion.'
    }
    Write-Host '[AP-03] Scene, camera and collision mesh ready.' -ForegroundColor Green
    Write-Host 'http://127.0.0.1:3000/?content=scene.ply&settings=lumia-ap03-settings.json&collision=lumia-ap03-collision.glb&webgl&lang=es' -ForegroundColor Yellow
    Write-Host '[AP-03] Ctrl+C detiene el servidor.' -ForegroundColor Cyan
    & npm.cmd run develop
    if ($LASTEXITCODE -ne 0) { throw 'El servidor termino con error.' }
}
finally { Pop-Location }
