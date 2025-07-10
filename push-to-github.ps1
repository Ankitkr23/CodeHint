# PowerShell script to resolve Git merge conflict
Set-Location "d:\OopsMyCode\CodeHint"

Write-Host "🔧 Resolving Git merge conflict..." -ForegroundColor Yellow

# Kill any stuck git processes
Get-Process | Where-Object {$_.ProcessName -eq "git"} | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process | Where-Object {$_.ProcessName -eq "vim"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Abort any ongoing merge
try {
    git merge --abort
    Write-Host "✅ Aborted previous merge" -ForegroundColor Green
} catch {
    Write-Host "⚠️ No merge to abort" -ForegroundColor Yellow
}

# Check git status
Write-Host "`n📋 Current Git Status:" -ForegroundColor Cyan
git status

# Pull with strategy to prefer our changes
Write-Host "`n⬇️ Pulling remote changes..." -ForegroundColor Cyan
git pull origin main --strategy-option=ours

# Add all changes
Write-Host "`n➕ Adding all changes..." -ForegroundColor Cyan
git add .

# Commit changes
Write-Host "`n💾 Committing changes..." -ForegroundColor Cyan
git commit -m "🔧 Fix: Resolve button functionality and enhance extension

- Fix all buttons not working (popup.js was empty)
- Add complete event handlers for hint, time, and space complexity buttons  
- Enhance code extraction with 7+ detection methods
- Improve error handling with retry logic for overloaded services
- Add comprehensive setup documentation
- Update package.json with proper metadata
- Add LICENSE, CHANGELOG, and SETUP.md files
- Fix client-server communication issues
- Ensure proper environment configuration"

# Push to GitHub
Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 Successfully updated GitHub repository!" -ForegroundColor Green
    Write-Host "✅ All files pushed successfully" -ForegroundColor Green
} else {
    Write-Host "`n❌ Failed to push to GitHub" -ForegroundColor Red
    Write-Host "Current status:" -ForegroundColor Yellow
    git status
}

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
