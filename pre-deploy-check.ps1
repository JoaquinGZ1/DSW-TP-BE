# Script de Verificacion Pre-Deploy
# Ejecutar: powershell -ExecutionPolicy Bypass -File pre-deploy-check.ps1

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  VERIFICACION PRE-DEPLOY" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Funcion para verificar archivo
function Test-FileExists {
    param($path, $description)
    if (Test-Path $path) {
        Write-Host "[OK] $description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[X] $description - FALTA" -ForegroundColor Red
        return $false
    }
}

# Verificar estructura de backend
Write-Host "BACKEND (DSW-TP)" -ForegroundColor Yellow
Write-Host "----------------------------------------------" -ForegroundColor Gray

$backendPath = "c:\Users\joaqu\Desktop\DSW\DSW-TP"
$allGood = (Test-FileExists "$backendPath\package.json" "package.json") -and $allGood
$allGood = (Test-FileExists "$backendPath\tsconfig.json" "tsconfig.json") -and $allGood
$allGood = (Test-FileExists "$backendPath\src\app.ts" "src/app.ts") -and $allGood
$allGood = (Test-FileExists "$backendPath\.gitignore" ".gitignore") -and $allGood
$allGood = (Test-FileExists "$backendPath\.env.production.example" ".env.production.example") -and $allGood

# Verificar package.json tiene script start
if (Test-Path "$backendPath\package.json") {
    $pkgContent = Get-Content "$backendPath\package.json" -Raw
    if ($pkgContent -match '"start".*node dist/app.js') {
        Write-Host "[OK] Script start configurado correctamente" -ForegroundColor Green
    } else {
        Write-Host "[X] Script start no encontrado o mal configurado" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""

# Verificar estructura de frontend
Write-Host "FRONTEND (DSW-TP-FE)" -ForegroundColor Yellow
Write-Host "----------------------------------------------" -ForegroundColor Gray

$frontendPath = "c:\Users\joaqu\Desktop\DSW\DSW-TP-FE"
$allGood = (Test-FileExists "$frontendPath\sge\package.json" "sge/package.json") -and $allGood
$allGood = (Test-FileExists "$frontendPath\sge\src\config.js" "sge/src/config.js") -and $allGood
$allGood = (Test-FileExists "$frontendPath\sge\.gitignore" "sge/.gitignore") -and $allGood
$allGood = (Test-FileExists "$frontendPath\vercel.json" "vercel.json") -and $allGood
$allGood = (Test-FileExists "$frontendPath\netlify.toml" "netlify.toml") -and $allGood

Write-Host ""

# Verificar documentacion
Write-Host "DOCUMENTACION" -ForegroundColor Yellow
Write-Host "----------------------------------------------" -ForegroundColor Gray

$allGood = (Test-FileExists "$backendPath\START_HERE.md" "START_HERE.md") -and $allGood
$allGood = (Test-FileExists "$backendPath\DEPLOY_QUICK.md" "DEPLOY_QUICK.md") -and $allGood
$allGood = (Test-FileExists "$backendPath\DEPLOY_GUIDE.md" "DEPLOY_GUIDE.md") -and $allGood
$allGood = (Test-FileExists "$backendPath\DEPLOY_CHECKLIST.md" "DEPLOY_CHECKLIST.md") -and $allGood

Write-Host ""

# Verificar .gitignore protege .env
Write-Host "SEGURIDAD" -ForegroundColor Yellow
Write-Host "----------------------------------------------" -ForegroundColor Gray

if (Test-Path "$backendPath\.gitignore") {
    $gitignoreContent = Get-Content "$backendPath\.gitignore" -Raw
    if ($gitignoreContent -match "\.env") {
        Write-Host "[OK] .env protegido en .gitignore (backend)" -ForegroundColor Green
    } else {
        Write-Host "[X] .env NO esta en .gitignore (backend)" -ForegroundColor Red
        $allGood = $false
    }
}

if (Test-Path "$frontendPath\sge\.gitignore") {
    $gitignoreContent = Get-Content "$frontendPath\sge\.gitignore" -Raw
    if ($gitignoreContent -match "\.env") {
        Write-Host "[OK] .env protegido en .gitignore (frontend)" -ForegroundColor Green
    } else {
        Write-Host "[X] .env NO esta en .gitignore (frontend)" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "  TODO CORRECTO - LISTO PARA DEPLOY" -ForegroundColor Green
    Write-Host ""
    Write-Host "Siguiente paso:" -ForegroundColor Cyan
    Write-Host "  1. Lee START_HERE.md" -ForegroundColor White
    Write-Host "  2. Sube tu codigo a GitHub" -ForegroundColor White
    Write-Host "  3. Despliega en Railway + Vercel" -ForegroundColor White
} else {
    Write-Host "  FALTAN ALGUNOS ARCHIVOS" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Revisa los archivos marcados con [X]" -ForegroundColor White
}

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Informacion adicional
Write-Host "ESTADISTICAS:" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "$backendPath\src") {
    $tsFiles = (Get-ChildItem -Path "$backendPath\src" -Filter "*.ts" -Recurse).Count
    Write-Host "  Archivos TypeScript (backend): $tsFiles" -ForegroundColor White
}

if (Test-Path "$frontendPath\sge\src") {
    $jsFiles = (Get-ChildItem -Path "$frontendPath\sge\src" -Filter "*.js" -Recurse).Count
    Write-Host "  Archivos JavaScript (frontend): $jsFiles" -ForegroundColor White
}

Write-Host ""
Write-Host "RECURSOS UTILES:" -ForegroundColor Cyan
Write-Host "  Railway: https://railway.app" -ForegroundColor White
Write-Host "  Vercel: https://vercel.com" -ForegroundColor White
Write-Host "  GitHub: https://github.com" -ForegroundColor White
Write-Host ""
