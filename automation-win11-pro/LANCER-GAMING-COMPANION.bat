@echo off
chcp 65001 >nul
title Gaming Companion - Demarrage Automatique
color 0B

echo ==========================================================================
echo    DEMARRAGE AUTOMATIQUE DE GAMING COMPANION SUR WINDOWS 11 PRO
echo ==========================================================================
echo.

cd /d "%~dp0.."

if not exist "node_modules" (
    echo [*] Premiere utilisation : Installation automatique des dependances...
    call npm install
)

echo [*] Ouverture automatique dans le navigateur sur http://localhost:3000 ...
start "" "http://localhost:3000"

echo [*] Lancement du serveur Gaming Companion...
call npm run dev
pause
