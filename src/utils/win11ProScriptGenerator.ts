export interface Win11AutomationConfig {
  enableGamingTurbo: boolean;
  enableDeepClean: boolean;
  enableWingetUpdate: boolean;
  enableWin11ProTweaks: boolean;
  enableSortDownloads: boolean;
  enableWeeklySchedule: boolean;
  enableFocusAssist: boolean;
  enableBackgroundApps: boolean;
  enableStorageSense: boolean;
  enablePrivacy: boolean;
  enableStartupManager: boolean;
  enableClipboardHistory: boolean;
  enableWindowSuggestions: boolean;
}

export function generateWin11ProBatchScript(cfg: Win11AutomationConfig): string {
  const lines: string[] = [
    '@echo off',
    'chcp 65001 >nul',
    'title Windows 11 Pro - Automatisation & Mode Gaming Turbo',
    'color 0B',
    'echo ==========================================================================',
    'echo    WINDOWS 11 PRO - AUTOMATISATION PC ^& MODE GAMING TURBO',
    'echo ==========================================================================',
    '',
    'net session >nul 2>&1',
    'if %errorLevel% neq 0 (',
    '    echo [!] Elevation en mode Administrateur en cours...',
    '    powershell -Command "Start-Process -FilePath \'%~f0\' -Verb RunAs"',
    '    exit /b',
    ')',
    '',
    'echo [*] Creation d\'un point de restauration systeme de securite...',
    'powershell -NoProfile -Command "Checkpoint-Computer -Description \'AutoPC_Win11Pro\' -RestorePointType \'MODIFY_SETTINGS\' -ErrorAction SilentlyContinue"',
  ];

  if (cfg.enableGamingTurbo) {
    lines.push(
      '',
      'echo.',
      'echo [1] ACTIVATION DU MODE GAMING TURBO (WINDOWS 11 PRO)...',
      'powershell -NoProfile -Command "$p = powercfg -list | Select-String \'e9a42b02-d5df-448d-aa00-03f14749eb61|Performances ultimes|Ultimate Performance\'; if (-not $p) { $p = powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 }; $g = ([regex]::Match($p, \'[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}\')).Value; if ($g) { powercfg -setactive $g }"',
      'reg add "HKCU\\Software\\Microsoft\\GameBar" /v "AllowAutoGameMode" /t REG_DWORD /d 1 /f >nul 2>&1',
      'reg add "HKCU\\Software\\Microsoft\\GameBar" /v "AutoGameModeEnabled" /t REG_DWORD /d 1 /f >nul 2>&1',
      'reg add "HKCU\\System\\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d 0 /f >nul 2>&1',
      'taskkill /F /IM Widgets.exe >nul 2>&1',
      'taskkill /F /IM WidgetService.exe >nul 2>&1',
      'taskkill /F /IM msteams.exe >nul 2>&1',
      'taskkill /F /IM Cortana.exe >nul 2>&1',
      'taskkill /F /IM GameBarPresenceWriter.exe >nul 2>&1',
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "NetworkThrottlingIndex" /t REG_DWORD /d 4294967295 /f >nul 2>&1',
      'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v "SystemResponsiveness" /t REG_DWORD /d 0 /f >nul 2>&1',
      'ipconfig /flushdns >nul 2>&1',
      'echo [OK] Mode Gaming Turbo actif (Performances Ultimes + Ping optimise) !'
    );
  }
  if (cfg.enableDeepClean) {
    lines.push(
      '',
      'echo.',
      'echo [2] NETTOYAGE PROFOND (TEMP, PREFETCH, CACHE SHADERS GPU, CORBEILLE)...',
      'del /q /f /s "%TEMP%\\*" >nul 2>&1',
      'del /q /f /s "C:\\Windows\\Temp\\*" >nul 2>&1',
      'del /q /f /s "C:\\Windows\\Prefetch\\*" >nul 2>&1',
      'del /q /f /s "%LOCALAPPDATA%\\D3DSCache\\*" >nul 2>&1',
      'del /q /f /s "%LOCALAPPDATA%\\NVIDIA\\DXCache\\*" >nul 2>&1',
      'del /q /f /s "%LOCALAPPDATA%\\AMD\\DxCache\\*" >nul 2>&1',
      'powershell -NoProfile -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"',
      'echo [OK] Nettoyage profond termine !'
    );
  }

  if (cfg.enableWin11ProTweaks) {
    lines.push(
      '',
      'echo.',
      'echo [3] OPTIMISATIONS WINDOWS 11 PRO (SOURIS 1:1, REACTIVITE, TELEMETRIE)...',
      'reg add "HKCU\\Control Panel\\Desktop" /v "MenuShowDelay" /t REG_SZ /d "0" /f >nul 2>&1',
      'reg add "HKCU\\Control Panel\\Desktop" /v "AutoEndTasks" /t REG_SZ /d "1" /f >nul 2>&1',
      'reg add "HKCU\\Control Panel\\Mouse" /v "MouseSpeed" /t REG_SZ /d "0" /f >nul 2>&1',
      'reg add "HKCU\\Control Panel\\Mouse" /v "MouseThreshold1" /t REG_SZ /d "0" /f >nul 2>&1',
      'reg add "HKCU\\Control Panel\\Mouse" /v "MouseThreshold2" /t REG_SZ /d "0" /f >nul 2>&1',
      'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 0 /f >nul 2>&1',
      'powercfg -h off >nul 2>&1',
      'echo [OK] Optimisations Windows 11 Pro appliquees !'
    );
  }

  if (cfg.enableSortDownloads) {
    lines.push(
      '',
      'echo.',
      'echo [4] TRI AUTOMATIQUE DU DOSSIER TELECHARGEMENTS...',
      'powershell -NoProfile -Command "$d = \\"$env:USERPROFILE\\Downloads\\"; $c = @{Images=@(\'.jpg\',\'.jpeg\',\'.png\',\'.gif\',\'.webp\');Documents=@(\'.pdf\',\'.docx\',\'.xlsx\',\'.txt\');Archives=@(\'.zip\',\'.rar\',\'.7z\');Programmes=@(\'.exe\',\'.msi\')}; Get-ChildItem $d -File | ForEach-Object { $e = $_.Extension.ToLower(); foreach($k in $c.Keys){ if($c[$k] -contains $e){ $t = Join-Path $d $k; New-Item $t -ItemType Directory -Force | Out-Null; Move-Item $_.FullName (Join-Path $t $_.Name) -Force -ErrorAction SilentlyContinue; break } } }"',
      'echo [OK] Dossier Telechargements range par categories !'
    );
  }

  if (cfg.enableWingetUpdate) {
    lines.push(
      '',
      'echo.',
      'echo [5] MISE A JOUR DE TOUS LES LOGICIELS DU PC (WINGET)...',
      'winget upgrade --all --include-unknown --accept-package-agreements --accept-source-agreements --silent',
      'echo [OK] Logiciels mis a jour !'
    );
  }

  if (cfg.enableWeeklySchedule) {
    lines.push(
      '',
      'echo.',
      'echo [6] ACTIVATION DE LA MAINTENANCE AUTOMATIQUE HEBDOMADAIRE...',
      'schtasks /Create /SC WEEKLY /D SUN /TN "Win11Pro_AutoGamingClean" /TR "\'%~f0\'" /ST 12:00 /RL HIGHEST /F >nul 2>&1',
      'echo [OK] Tache planifiee creee (Tous les dimanches a 12h00) !'
    );
  }

  if (cfg.enableFocusAssist) {
    lines.push(
      '',
      'echo.',
      'echo [7] FOCUS ASSIST GAMING (Notifications coupees)...',
      'reg add "HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" /v "ToastEnabled" /t REG_DWORD /d 0 /f >nul 2>&1',
      'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\QuietHours" /v "UserSelectedQuietHoursProfile" /t REG_SZ /d "1" /f >nul 2>&1',
      'echo [OK] Notifications desactivees - Aucune interruption en jeu'
    );
  }

  if (cfg.enableBackgroundApps) {
    lines.push(
      '',
      'echo.',
      'echo [8] APPLICATIONS EN ARRIERE-PLAN...',
      'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v "GlobalUserDisabled" /t REG_DWORD /d 1 /f >nul 2>&1',
      'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppPrivacy" /v "LetAppsRunInBackground" /t REG_DWORD /d 2 /f >nul 2>&1',
      'echo [OK] Applications en arriere-plan desactivees (RAM et CPU liberes)'
    );
  }

  if (cfg.enableStorageSense) {
    lines.push(
      '',
      'echo.',
      'echo [9] STOCKAGE SENSE (Nettoyage automatique du disque)...',
      'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\StorageSense\\Parameters\\StoragePolicy" /v "01" /t REG_DWORD /d 1 /f >nul 2>&1',
      'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\StorageSense\\Parameters\\StoragePolicy" /v "2048" /t REG_DWORD /d 1 /f >nul 2>&1',
      'echo [OK] Stockage Sense active (Windows nettoiera le disque tout seul)'
    );
  }

  if (cfg.enablePrivacy) {
    lines.push(
      '',
      'echo.',
      'echo [10] CONFIDENTIALITE RENFORCEE (Telemetrie et pubs)...',
      'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" /v "Enabled" /t REG_DWORD /d 0 /f >nul 2>&1',
      'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 0 /f >nul 2>&1',
      'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SubscribedContent-310093Enabled" /t REG_DWORD /d 0 /f >nul 2>&1',
      'echo [OK] Confidentialite renforcee - Identifiant publicitaire et telemetrie bloques'
    );
  }

  if (cfg.enableStartupManager) {
    lines.push(
      '',
      'echo.',
      'echo [11] AUDIT DES APPLICATIONS AU DEMARRAGE...',
      'echo --- Applications utilisateur (HKCU) ---',
      'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" 2>nul',
      'echo --- Applications systeme (HKLM) ---',
      'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run" 2>nul',
      'echo [OK] Liste affichee ci-dessus - Desactivez les inutiles dans le Gestionnaire des taches'
    );
  }

  if (cfg.enableClipboardHistory) {
    lines.push(
      '',
      'echo.',
      'echo [12] HISTORIQUE DU PRESSE-PAPIERS...',
      'reg add "HKCU\\Software\\Microsoft\\Clipboard" /v "EnableClipboardHistory" /t REG_DWORD /d 0 /f >nul 2>&1',
      'powershell -NoProfile -Command "Set-Clipboard -Value $null" >nul 2>&1',
      'echo [OK] Historique du presse-papiers desactive et vide'
    );
  }

  if (cfg.enableWindowSuggestions) {
    lines.push(
      '',
      'echo.',
      'echo [13] SUGGESTIONS ET PUBLICITES WINDOWS...',
      'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SubscribedContent-338388Enabled" /t REG_DWORD /d 0 /f >nul 2>&1',
      'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SystemPaneSuggestionsEnabled" /t REG_DWORD /d 0 /f >nul 2>&1',
      'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v "SubscribedContent-353694Enabled" /t REG_DWORD /d 0 /f >nul 2>&1',
      'echo [OK] Suggestions, conseils et publicites Windows desactives'
    );
  }

  lines.push(
    '',
    'echo.',
    'echo ==========================================================================',
    'echo    TOUTES LES AUTOMATISATIONS WINDOWS 11 PRO SONT TERMINEES !',
    'echo ==========================================================================',
    'pause'
  );

  return lines.join('\r\n');
}
