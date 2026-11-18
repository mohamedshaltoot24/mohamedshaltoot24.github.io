@echo off
rem Double-click this file to view the site on your computer.
rem It opens http://localhost:8790 in your browser. Close this window to stop.
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed, so the local preview can't start.
  echo Open the published site instead: https://mohamedshaltoot24.github.io
  pause
  exit /b 1
)
start "" "http://localhost:8790"
node "%~dp0tools\serve.js" "%~dp0." 8790
