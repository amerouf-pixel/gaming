@echo off
chcp 65001 >nul
title Windows 11 Pro - Automatisation ^& Mode Gaming Turbo
color 0B

echo ==========================================================================
echo    LANCEMENT DE L'AUTOMATISATION WINDOWS 11 PRO (MODE ADMINISTRATEUR)
echo ==========================================================================
echo.

:: Verification et elevation automatique en Administrateur
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] Demande des droits Administrateur pour optimiser Windows 11 Pro...
    powershell -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

:: Lancement du script PowerShell avec ExecutionPolicy Bypass
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Win11Pro-Gaming-Optimizer.ps1"
pause
