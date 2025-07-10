@echo off
echo Starting CodeHint AI Server...
echo.
echo Make sure you have your GEMINI_API_KEY in the .env file
echo.
cd /d "d:\OopsMyCode\CodeHint"
echo Current directory: %CD%
echo.
node server.mjs
pause
