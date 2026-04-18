# TN-MBNR Deployment Helper Script (Hardened Version)
Write-Host "[DEPLOY] Preparing to push production-grade configurations..." -ForegroundColor Cyan

# Check if git is initialized
if (!(Test-Path .git)) {
    Write-Error "Git repository not found in this directory."
    exit
}

# Add changes
Write-Host "[STAGE] Staging changes..."
git add .

# Commit changes
Write-Host "[COMMIT] Committing changes..."
git commit -m "chore: optimize for render deployment with persistent storage"

# Push to Main
Write-Host "[PUSH] Pushing to GitHub (origin main)..."
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Next step: Go to https://dashboard.render.com and link your repository." -ForegroundColor Yellow
} else {
    Write-Host "[ERROR] Push failed. Please check your GitHub permissions or credentials." -ForegroundColor Red
}

Write-Host "Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
