# LUMIA AP-02 | Iniciar visor Gaussian en Windows PowerShell 5.1
# Uso desde la raiz del repositorio:
#   .\lumia\scripts\start-ap02.ps1
# Opcional: reinstalar dependencias:
#   .\lumia\scripts\start-ap02.ps1 -Reinstall
param([switch]$Reinstall)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$sceneDir = Join-Path $repoRoot 'lumia\scenes\ap02-demo'
$publicDir = Join-Path $repoRoot 'public'

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    throw 'No se encontro npm.cmd. Instala Node.js 20+ y abre una nueva ventana de PowerShell.'
}

foreach ($file in @('scene.ply', 'settings.json')) {
    if (-not (Test-Path (Join-Path $sceneDir $file))) {
        throw "Falta el archivo versionado: $file en $sceneDir"
    }
}

Push-Location $repoRoot
try {
    if ($Reinstall -or -not (Test-Path 'node_modules')) {
        Write-Host '[LUMIA AP-02] Instalando dependencias con npm ci...' -ForegroundColor Cyan
        & npm.cmd ci
        if ($LASTEXITCODE -ne 0) {
            throw 'npm ci fallo; revisa el error anterior.'
        }
    }

    New-Item -ItemType Directory -Force -Path $publicDir | Out-Null
    Copy-Item (Join-Path $sceneDir 'scene.ply') (Join-Path $publicDir 'scene.ply') -Force
    Copy-Item (Join-Path $sceneDir 'settings.json') (Join-Path $publicDir 'settings.json') -Force

    Write-Host '[LUMIA AP-02] Escena y configuracion restauradas en public.' -ForegroundColor Green
    Write-Host '[LUMIA AP-02] Abre: http://127.0.0.1:3000/?content=scene.ply&webgl&lang=es' -ForegroundColor Yellow
    Write-Host '[LUMIA AP-02] Deja esta ventana abierta. Ctrl+C detiene el servidor.' -ForegroundColor Cyan

    & npm.cmd run develop
    if ($LASTEXITCODE -ne 0) {
        throw 'El servidor se detuvo con un error.'
    }
}
finally {
    Pop-Location
}
