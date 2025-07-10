Write-Host "🚀 Starting CodeHint AI Server..." -ForegroundColor Green
Write-Host ""
Write-Host "📁 Navigating to CodeHint directory..." -ForegroundColor Yellow
Set-Location "d:\OopsMyCode\CodeHint"
Write-Host "📍 Current directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔑 Checking for API key..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found! Please create it with your GEMINI_API_KEY" -ForegroundColor Red
    Read-Host "Press Enter to continue anyway"
}
Write-Host ""
Write-Host "🚀 Starting server..." -ForegroundColor Green
Write-Host "📝 The server will run on http://localhost:3000" -ForegroundColor Cyan
Write-Host "🛑 Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
node server.mjs
