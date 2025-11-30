# ------------------------------------------
# 🚀 PowerShell Deploy Script
# ------------------------------------------

# Set directories for frontend, backend, and deploy
$frontendDir = Join-Path $PSScriptRoot "frontend"
$backendDir  = Join-Path $PSScriptRoot "backend"
$deployDir   = Join-Path $PSScriptRoot "deploy"

# Remove previous deploy folder if exists
if (Test-Path $deployDir) {
    Write-Host "🗑️ Cleaning old deploy..."
    Remove-Item $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# ---------------------------
# Frontend build
# ---------------------------
Write-Host "🔨 Building frontend..."
Push-Location $frontendDir

npm install
if ($LASTEXITCODE -ne 0) { Write-Error "❌ Frontend npm install failed"; Pop-Location; exit 1 }

npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "❌ Frontend build failed"; Pop-Location; exit 1 }

# Copy frontend dist contents (not the folder itself) to deploy/frontend
$frontendDist = Join-Path $frontendDir "dist"
$frontendDeploy = Join-Path $deployDir "frontend"

if (-Not (Test-Path $frontendDeploy)) {
    New-Item -ItemType Directory -Path $frontendDeploy | Out-Null
}

# Copy all files and folders inside dist
Get-ChildItem -Path $frontendDist | ForEach-Object {
    Copy-Item $_.FullName -Destination $frontendDeploy -Recurse -Force
}

Pop-Location

# ---------------------------
# Backend build
# ---------------------------
Write-Host "🔨 Building backend..."
Push-Location $backendDir

npm install
if ($LASTEXITCODE -ne 0) { Write-Error "❌ Backend npm install failed"; Pop-Location; exit 1 }

npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "❌ Backend build failed"; Pop-Location; exit 1 }

# Copy backend dist contents to deploy/backend
$backendDist = Join-Path $backendDir "dist"
$backendDeploy = Join-Path $deployDir "backend"

if (-Not (Test-Path $backendDeploy)) {
    New-Item -ItemType Directory -Path $backendDeploy | Out-Null
}

Copy-Item "$backendDist\*" $backendDeploy -Recurse -Force

Pop-Location

# ---------------------------
# Deploy finished
# ---------------------------
Write-Host "==========================================="
Write-Host "✅ DEPLOY COMPLETED"
Write-Host "Build is located at: $($deployDir)"
Write-Host "==========================================="
