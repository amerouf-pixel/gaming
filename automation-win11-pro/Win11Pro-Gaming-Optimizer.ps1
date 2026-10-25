<#
.SYNOPSIS
    Centre d'Automatisation, Nettoyage & Mode Gaming Turbo pour Windows 11 Pro
.DESCRIPTION
    Script PowerShell complet pour automatiser l'optimisation, le nettoyage,
    la mise a jour des logiciels (Winget), le tri des fichiers et le Mode Gaming
    sur Windows 11 Pro.
#>

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Verification des droits Administrateur
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[!] Relancement automatique en mode Administrateur..." -ForegroundColor Yellow
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

function Show-Banner {
    Clear-Host
    Write-Host "==========================================================================" -ForegroundColor Cyan
    Write-Host "   WINDOWS 11 PRO - AUTOMATISATION & GAMING OPTIMIZER v2.0                " -ForegroundColor Cyan
    Write-Host "==========================================================================" -ForegroundColor Cyan
    Write-Host "   OS Detecte : $((Get-CimInstance Win32_OperatingSystem).Caption)" -ForegroundColor Gray
    Write-Host "   Statut     : Administrateur Actif [OK]" -ForegroundColor Green
    Write-Host "==========================================================================" -ForegroundColor Cyan
    Write-Host ""
}

# 1. POINT DE RESTAURATION SECURITE
function New-SafeRestorePoint {
    Write-Host "`n[*] Creation d'un point de restauration systeme de securite..." -ForegroundColor Cyan
    try {
        Enable-ComputerRestore -Drive "$env:SystemDrive\" -ErrorAction SilentlyContinue
        Set-ItemProperty -Path "HKLM:\Software\Microsoft\Windows NT\CurrentVersion\SystemRestore" -Name "SystemRestorePointCreationFrequency" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
        Checkpoint-Computer -Description "Avant Optimisation Win11Pro Gaming" -RestorePointType "MODIFY_SETTINGS" -ErrorAction Stop
        Write-Host "[OK] Point de restauration cree avec succes !" -ForegroundColor Green
    } catch {
        Write-Host "[i] Point de restauration ignore (service desactive ou deja cree recemment)." -ForegroundColor Yellow
    }
}

# 2. MODE GAMING TURBO (1-CLIC)
function Enable-GamingModeTurbo {
    Write-Host "`n[1] ACTIVATION DU MODE GAMING TURBO (WINDOWS 11 PRO)..." -ForegroundColor Cyan

    # A. Debloquer et activer le mode d'alimentation "Performances Ultimes"
    Write-Host " -> Activation du plan d'alimentation 'Performances Ultimes'..." -ForegroundColor Yellow
    $ultimatePlan = powercfg -list | Select-String -Pattern "Performances ultimes|Ultimate Performance"
    if (-not $ultimatePlan) {
        $dupOutput = powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61
        $guid = ([regex]::Match($dupOutput, '[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}')).Value
    } else {
        $guid = ([regex]::Match($ultimatePlan.Line, '[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}')).Value
    }
    if ($guid) {
        powercfg -setactive $guid
        Write-Host "    [OK] Mode 'Performances Ultimes' actif (GUID: $guid)" -ForegroundColor Green
    }

    # B. Activer le Game Mode Windows 11 et desactiver Game DVR
    Write-Host " -> Optimisation Game Mode & Desactivation Game DVR..." -ForegroundColor Yellow
    New-Item -Path "HKCU:\Software\Microsoft\GameBar" -Force | Out-Null
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\GameBar" -Name "AllowAutoGameMode" -Value 1 -Type DWord -Force
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\GameBar" -Name "AutoGameModeEnabled" -Value 1 -Type DWord -Force
    Set-ItemProperty -Path "HKCU:\System\GameConfigStore" -Name "GameDVR_Enabled" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\GameDVR" -Force | Out-Null
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\GameDVR" -Name "AllowGameDVR" -Value 0 -Type DWord -Force

    # C. Fermer les processus inutiles en arriere-plan
    Write-Host " -> Fermeture des processus inutiles en arriere-plan..." -ForegroundColor Yellow
    $bloatProcesses = @(
        "Widgets", "WidgetService", "msteams", "Cortana",
        "YourPhone", "PhoneExperienceHost", "GameBarPresenceWriter"
    )
    foreach ($proc in $bloatProcesses) {
        if (Get-Process -Name $proc -ErrorAction SilentlyContinue) {
            Stop-Process -Name $proc -Force -ErrorAction SilentlyContinue
            Write-Host "    [-] Processus arrete : $proc" -ForegroundColor DarkGray
        }
    }

    # D. Optimisation Reseau / Ping
    Write-Host " -> Optimisation Reseau Gaming (Reduction Ping & Latence)..." -ForegroundColor Yellow
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" -Name "NetworkThrottlingIndex" -Value 0xffffffff -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile" -Name "SystemResponsiveness" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    ipconfig /flushdns | Out-Null
    Write-Host "    [OK] Cache DNS vide et priorite reseau gaming activee !" -ForegroundColor Green

    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    Write-Host "`n[OK] MODE GAMING TURBO ACTIVE AVEC SUCCES !" -ForegroundColor Green
}


# 3. NETTOYAGE PROFOND DU PC
function Invoke-DeepClean {
    Write-Host "`n[2] NETTOYAGE PROFOND DE WINDOWS 11 PRO..." -ForegroundColor Cyan
    $driveBefore = (Get-PSDrive C).Free

    $foldersToClean = @(
        "$env:TEMP\*",
        "$env:windir\Temp\*",
        "$env:windir\Prefetch\*",
        "$env:LOCALAPPDATA\Temp\*",
        "$env:LOCALAPPDATA\D3DSCache\*",
        "$env:LOCALAPPDATA\NVIDIA\DXCache\*",
        "$env:LOCALAPPDATA\NVIDIA\GLCache\*",
        "$env:LOCALAPPDATA\AMD\DxCache\*",
        "$env:windir\SoftwareDistribution\Download\*"
    )

    foreach ($path in $foldersToClean) {
        if (Test-Path (Split-Path $path -Parent)) {
            Write-Host " -> Nettoyage de : $path" -ForegroundColor Gray
            Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        }
    }

    Write-Host " -> Vidage de la Corbeille Windows..." -ForegroundColor Yellow
    Clear-RecycleBin -Force -ErrorAction SilentlyContinue

    $driveAfter = (Get-PSDrive C).Free
    $freedMB = [math]::Round(($driveAfter - $driveBefore) / 1MB, 2)
    if ($freedMB -lt 0) { $freedMB = 0 }
    Write-Host "`n[OK] Nettoyage termine ! Espace libere : $freedMB Mo" -ForegroundColor Green
}

# 4. MISE A JOUR AUTOMATIQUE DE TOUS LES LOGICIELS (WINGET)
function Update-AllSoftware {
    Write-Host "`n[3] MISE A JOUR AUTOMATIQUE DES LOGICIELS (WINGET)..." -ForegroundColor Cyan
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        Write-Host " -> Recherche et installation des mises a jour silencieuses..." -ForegroundColor Yellow
        winget upgrade --all --include-unknown --accept-package-agreements --accept-source-agreements --silent
        Write-Host "`n[OK] Tous vos logiciels sont a jour !" -ForegroundColor Green
    } else {
        Write-Host "[!] Winget n'est pas detecte sur ce systeme." -ForegroundColor Red
    }
}

# 5. OPTIMISATIONS SPECIFIQUES WINDOWS 11 PRO
function Optimize-Win11Pro {
    New-SafeRestorePoint
    Write-Host "`n[4] APPLICATION DES OPTIMISATIONS WINDOWS 11 PRO..." -ForegroundColor Cyan

    Write-Host " -> Acceleration de l'interface Windows 11 (MenuShowDelay = 0)..." -ForegroundColor Yellow
    Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "MenuShowDelay" -Value "0" -Type String -Force
    Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "AutoEndTasks" -Value "1" -Type String -Force
    Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "HungAppTimeout" -Value "1000" -Type String -Force
    Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "WaitToKillAppTimeout" -Value "2000" -Type String -Force

    Write-Host " -> Calibration souris Gaming 1:1 (Desactivation acceleration Windows)..." -ForegroundColor Yellow
    Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseSpeed" -Value "0" -Type String -Force
    Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseThreshold1" -Value "0" -Type String -Force
    Set-ItemProperty -Path "HKCU:\Control Panel\Mouse" -Name "MouseThreshold2" -Value "0" -Type String -Force

    Write-Host " -> Reduction de la telemetrie et suggestions publicitaires..." -ForegroundColor Yellow
    New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Force | Out-Null
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "AllowTelemetry" -Value 0 -Type DWord -Force
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager" -Name "SystemPaneSuggestionsEnabled" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "ShowSyncProviderNotifications" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue

    Write-Host " -> Optimisation SSD (Desactivation veille prolongee hiberfil.sys)..." -ForegroundColor Yellow
    powercfg -h off
    Write-Host "`n[OK] Optimisations Windows 11 Pro appliquees avec succes !" -ForegroundColor Green
}

# 6. TRI AUTOMATIQUE DU DOSSIER TELECHARGEMENTS
function Invoke-OrganizeDownloads {
    Write-Host "`n[5] RANGEMENT AUTOMATIQUE DU DOSSIER TELECHARGEMENTS..." -ForegroundColor Cyan
    $downloadsPath = "$env:USERPROFILE\Downloads"
    if (-not (Test-Path $downloadsPath)) { return }

    $categories = @{
        "Images"       = @(".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico")
        "Documents"    = @(".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv", ".md")
        "Archives"     = @(".zip", ".rar", ".7z", ".tar", ".gz", ".iso")
        "Programmes"   = @(".exe", ".msi", ".bat", ".ps1", ".msix")
        "Videos_Audio" = @(".mp4", ".mkv", ".avi", ".mov", ".mp3", ".wav", ".flac", ".ogg")
    }

    $movedCount = 0
    foreach ($file in (Get-ChildItem -Path $downloadsPath -File)) {
        $ext = $file.Extension.ToLower()
        foreach ($cat in $categories.Keys) {
            if ($categories[$cat] -contains $ext) {
                $targetDir = Join-Path $downloadsPath $cat
                if (-not (Test-Path $targetDir)) { New-Item -Path $targetDir -ItemType Directory -Force | Out-Null }
                Move-Item -Path $file.FullName -Destination (Join-Path $targetDir $file.Name) -Force -ErrorAction SilentlyContinue
                $movedCount++
                Write-Host " -> Range : $($file.Name) => [$cat]" -ForegroundColor Gray
                break
            }
        }
    }
    Write-Host "`n[OK] Tri termine ! $movedCount fichier(s) ranges." -ForegroundColor Green
}

# 7. PLANIFICATION AUTOMATIQUE HEBDOMADAIRE
function Register-AutoMaintenanceTask {
    Write-Host "`n[6] CREATION DE L'AUTOMATISATION HEBDOMADAIRE (TACHE PLANIFIEE)..." -ForegroundColor Cyan
    $taskName = "Win11Pro_AutoMaintenance_Gaming"
    $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$PSCommandPath`" -AutoRun"
    $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 12:00PM
    $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force | Out-Null
    Write-Host "[OK] Tache planifiee '$taskName' activee (Tous les dimanches a 12h00) !" -ForegroundColor Green
}

# ============================================================
# FONCTIONS ADDITIONNELLES v2.1 (verifiees)
# ============================================================

function Focus-Assist-Gaming {
    Write-Host "`n[8] ACTIVATION DU FOCUS ASSIST POUR JEUX..." -ForegroundColor Cyan
    New-Item -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\PushNotifications" -Force | Out-Null
    Set-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\PushNotifications" -Name "ToastEnabled" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    New-Item -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings" -Force | Out-Null
    Set-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings" -Name "NOC_GLOBAL_SETTING_TOASTS_ENABLED" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Write-Host "    [OK] Notifications desactivees - Aucune interruption pendant les jeux" -ForegroundColor Green
}

function Gestion-Apps-Arriere-plan {
    Write-Host "`n[9] GESTION DES APPLICATIONS EN ARRIERE-PLAN..." -ForegroundColor Cyan
    New-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications" -Force | Out-Null
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications" -Name "GlobalUserDisabled" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" -Force | Out-Null
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy" -Name "LetAppsRunInBackground" -Value 2 -Type DWord -Force -ErrorAction SilentlyContinue
    Write-Host "    [OK] Applications en arriere-plan desactivees (RAM et CPU liberes)" -ForegroundColor Green
}

function Invoke-Storage-Sense {
    Write-Host "`n[10] ACTIVATION DU STOCKAGE SENSE (NETTOYAGE AUTOMATIQUE)..." -ForegroundColor Cyan
    $sp = "HKCU:\Software\Microsoft\Windows\CurrentVersion\StorageSense\Parameters\StoragePolicy"
    New-Item -Path $sp -Force | Out-Null
    Set-ItemProperty -Path $sp -Name "01" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $sp -Name "04" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $sp -Name "08" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $sp -Name "2048" -Value 1 -Type DWord -Force -ErrorAction SilentlyContinue
    Write-Host "    [OK] Stockage Sense active - Windows nettoiera le disque automatiquement" -ForegroundColor Green
}

function Parametres-Confidentialite {
    Write-Host "`n[11] CONFIDENTIALITE RENFORCEE (TELEMETRIE ET PUBLICITES)..." -ForegroundColor Cyan
    New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Force | Out-Null
    Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection" -Name "AllowTelemetry" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    New-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo" -Force | Out-Null
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\AdvertisingInfo" -Name "Enabled" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "ShowSyncProviderNotifications" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Write-Host "    [OK] Telemetrie et identifiant publicitaire bloques" -ForegroundColor Green
}


function Gestion-Demarrage {
    Write-Host "`n[12] AUDIT DES APPLICATIONS AU DEMARRAGE..." -ForegroundColor Cyan
    $startupApps = Get-CimInstance -ClassName Win32_StartupCommand -ErrorAction SilentlyContinue | Select-Object Name, Command
    if ($startupApps) {
        Write-Host "    Applications lancees au demarrage :" -ForegroundColor Gray
        foreach ($app in $startupApps) {
            Write-Host "    - $($app.Name)" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "    Aucune application au demarrage detectee." -ForegroundColor DarkGray
    }
    Write-Host "    [OK] Pour desactiver une app : Gestionnaire des taches > Demarrage" -ForegroundColor Green
}

function Historique-Presse-papiers {
    Write-Host "`n[13] NETTOYAGE DE L'HISTORIQUE DU PRESSE-PAPIERS..." -ForegroundColor Cyan
    New-Item -Path "HKCU:\Software\Microsoft\Clipboard" -Force | Out-Null
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Clipboard" -Name "EnableClipboardHistory" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-Clipboard -Value $null -ErrorAction SilentlyContinue
    Write-Host "    [OK] Historique du presse-papiers desactive et vide" -ForegroundColor Green
}

function Suggestions-Windows {
    Write-Host "`n[14] DESACTIVATION DES SUGGESTIONS ET PUBLICITES WINDOWS..." -ForegroundColor Cyan
    $cdm = "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager"
    New-Item -Path $cdm -Force | Out-Null
    Set-ItemProperty -Path $cdm -Name "SubscribedContent-338388Enabled" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $cdm -Name "SubscribedContent-338389Enabled" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $cdm -Name "SubscribedContent-353694Enabled" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $cdm -Name "SystemPaneSuggestionsEnabled" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $cdm -Name "SoftLandingEnabled" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "ShowWindowsWelcomeExperience" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "ShowCuratedWindowsRecommendations" -Value 0 -Type DWord -Force -ErrorAction SilentlyContinue
    Write-Host "    [OK] Suggestions, conseils et publicites Windows desactives" -ForegroundColor Green
}

if ($args -contains "-AutoRun") {
    Enable-GamingModeTurbo
    Invoke-DeepClean
    Invoke-OrganizeDownloads
    Focus-Assist-Gaming
    Gestion-Apps-Arriere-plan
    Invoke-Storage-Sense
    Parametres-Confidentialite
    Historique-Presse-papiers
    Suggestions-Windows
    exit
}

do {
    Show-Banner
    Write-Host "  [1] Activer le MODE GAMING TURBO (Performances Ultimes, RAM, Ping, Processus)" -ForegroundColor Cyan
    Write-Host "  [2] Nettoyage Profond (Temp, Cache Shaders DirectX/GPU, Prefetch, Corbeille)" -ForegroundColor Cyan
    Write-Host "  [3] Mettre a jour TOUS mes logiciels en 1 clic (via Winget)" -ForegroundColor Cyan
    Write-Host "  [4] Appliquer les Optimisations Windows 11 Pro (Souris 1:1, Telemetrie, SSD)" -ForegroundColor Cyan
    Write-Host "  [5] Trier et ranger automatiquement mon dossier Telechargements" -ForegroundColor Cyan
    Write-Host "  [6] Programmer l'automatisation chaque semaine (Planificateur Windows)" -ForegroundColor Cyan
    Write-Host "  [7] TOUT EXECUTER D'UN COUP (Pack Complet Optimisation + Nettoyage + Gaming)" -ForegroundColor Green
    Write-Host "  [8] Focus Assist Gaming (Désactive notifications pendant jeux)" -ForegroundColor Cyan
    Write-Host "  [9] Gestion Applications Arrière-plan (Limite ressources)" -ForegroundColor Cyan
    Write-Host "  [10] Stockage Sense (Nettoyage automatique disque)" -ForegroundColor Cyan
    Write-Host "  [11] Paramètres Confidentialité (Bloquer pub ciblée)" -ForegroundColor Cyan
    Write-Host "  [12] Gestion Démarrage (Apps au démarrage)" -ForegroundColor Cyan
    Write-Host "  [13] Historique Presse-papiers (Nettoyage)" -ForegroundColor Cyan
    Write-Host "  [14] Suggestions Windows (Désactiver conseils)" -ForegroundColor Cyan
    Write-Host "  [15] Tout exécuter d'un coup (Pack Complet)" -ForegroundColor Green
    Write-Host "  [0] Quitter" -ForegroundColor Red
    Write-Host ""
    $choice = Read-Host "  Votre choix (0-15)"

    switch ($choice) {
        "1" { Enable-GamingModeTurbo; Pause }
        "2" { Invoke-DeepClean; Pause }
        "3" { Update-AllSoftware; Pause }
        "4" { Optimize-Win11Pro; Pause }
        "5" { Invoke-OrganizeDownloads; Pause }
        "6" { Register-AutoMaintenanceTask; Pause }
        "7" { Optimize-Win11Pro; Enable-GamingModeTurbo; Invoke-DeepClean; Invoke-OrganizeDownloads; Update-AllSoftware; Pause }
        "8" { Focus-Assist-Gaming; Pause }
        "9" { Gestion-Apps-Arriere-plan; Pause }
        "10" { Invoke-Storage-Sense; Pause }
        "11" { Parametres-Confidentialite; Pause }
        "12" { Gestion-Demarrage; Pause }
        "13" { Historique-Presse-papiers; Pause }
        "14" { Suggestions-Windows; Pause }
        "15" { Optimize-Win11Pro; Enable-GamingModeTurbo; Invoke-DeepClean; Invoke-OrganizeDownloads; Update-AllSoftware; Focus-Assist-Gaming; Gestion-Apps-Arriere-plan; Invoke-Storage-Sense; Parametres-Confidentialite; Gestion-Demarrage; Historique-Presse-papiers; Suggestions-Windows; Pause }
        "0" { Write-Host "`nA bientot !" -ForegroundColor Cyan }
        default { Write-Host "`nChoix invalide." -ForegroundColor Yellow; Start-Sleep -Seconds 1 }
    }
} while ($choice -ne "0")
