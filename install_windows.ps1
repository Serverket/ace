# Automated Installer for ACE on Windows
$ScriptDir = $PSScriptRoot
Set-Location $ScriptDir
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ACE Installer - A Cuanto Esta" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# --- 1. Check Python ---
if (-not (Get-Command "python" -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Python is not installed or not in the PATH." -ForegroundColor Red
    Write-Host "Download it at: https://www.python.org/downloads/" -ForegroundColor Yellow
    Pause; exit 1
}
$PyVersion = python --version 2>&1
Write-Host "[OK] $PyVersion detected." -ForegroundColor Green

# --- 2. Key paths ---
$VenvDir  = Join-Path $ScriptDir "venv"
$PythonW  = Join-Path $VenvDir "Scripts\pythonw.exe"
$PythonEx = Join-Path $VenvDir "Scripts\python.exe"
$PipExe   = Join-Path $VenvDir "Scripts\pip.exe"
$AcePy    = Join-Path $ScriptDir "ace.py"
$ReqsTxt  = Join-Path $ScriptDir "requirements.txt"
$VbsPath  = Join-Path $ScriptDir "launch_ace.vbs"
$LogPath  = Join-Path $ScriptDir "ace_error.log"

# --- 3. Create virtual environment ---
Write-Host ""
Write-Host "[1/4] Creating virtual environment..." -ForegroundColor Cyan
if (Test-Path $VenvDir) {
    Write-Host "      Removing previous venv..."
    Remove-Item -Recurse -Force $VenvDir
}
python -m venv $VenvDir
if (-not (Test-Path $PythonW)) {
    Write-Host "[ERROR] pythonw.exe not found. Check your Python installation." -ForegroundColor Red
    Pause; exit 1
}
Write-Host "      [OK] venv created." -ForegroundColor Green

# --- 4. Install dependencies ---
Write-Host ""
Write-Host "[2/4] Installing dependencies..." -ForegroundColor Cyan
& $PipExe install --upgrade pip -q
& $PipExe install -r $ReqsTxt
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Dependency installation failed." -ForegroundColor Red
    Pause; exit 1
}
Write-Host "      [OK] Dependencies installed." -ForegroundColor Green

# pywin32 post-installation (registers DLLs on Windows, required by pystray)
$PostInstall = Join-Path $VenvDir "Scripts\pywin32_postinstall.py"
if (Test-Path $PostInstall) {
    Write-Host "      Configuring pywin32..."
    & $PythonEx $PostInstall -install 2>$null
}

# --- 5. Generate VBScript launcher ---
# This is the most reliable method for launching tray apps on Windows:
# wscript.exe runs the VBS completely silently (no console, no window).
Write-Host ""
Write-Host "[3/4] Generating launcher..." -ForegroundColor Cyan
# Clear previous log
if (Test-Path $LogPath) { Remove-Item $LogPath -Force }

$VbsContent = @"
' ACE Widget Launcher
' Launches pythonw.exe silently (no console or window)
Set oShell = CreateObject("WScript.Shell")
oShell.CurrentDirectory = "$ScriptDir"
oShell.Run Chr(34) & "$PythonW" & Chr(34) & " " & Chr(34) & "$AcePy" & Chr(34), 0, False
"@
$VbsContent | Out-File -FilePath $VbsPath -Encoding ASCII
Write-Host "      [OK] launch_ace.vbs generated." -ForegroundColor Green

# --- 6. Create shortcuts ---
Write-Host ""
Write-Host "[4/4] Creating shortcuts..." -ForegroundColor Cyan
$WshShell    = New-Object -comObject WScript.Shell
$WScript     = "$env:SystemRoot\System32\wscript.exe"
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$StartupPath = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Startup"

if (-not (Test-Path $StartupPath)) {
    New-Item -ItemType Directory -Path $StartupPath | Out-Null
}

foreach ($LinkPath in @("$DesktopPath\ACE Widget.lnk", "$StartupPath\ACE Widget.lnk")) {
    $Link                  = $WshShell.CreateShortcut($LinkPath)
    $Link.TargetPath       = $WScript
    $Link.Arguments        = "`"$VbsPath`""
    $Link.WorkingDirectory = $ScriptDir
    $Link.WindowStyle      = 1
    $Link.Description      = "ACE Widget (Venezuela Exchange Rates)"
    $Link.IconLocation     = "$ScriptDir\assets\logo.ico"
    $Link.Save()
}
Write-Host "      [OK] Shortcut added to Desktop and Windows Startup." -ForegroundColor Green

# --- 7. Quick verification with visible console ---
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Verifying ACE can start..." -ForegroundColor Cyan
Write-Host "  (any errors will be shown here directly)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Quick test with visible python.exe to catch import errors
$TestResult = & $PythonEx -c "import pystray; from PIL import Image; import plyer; import requests; print('OK')" 2>&1
if ($TestResult -eq "OK") {
    Write-Host "[OK] All dependencies imported correctly." -ForegroundColor Green
    Write-Host ""
    Write-Host "Launching ACE now via wscript..." -ForegroundColor Cyan
    Start-Process -FilePath $WScript -ArgumentList "`"$VbsPath`""
    Start-Sleep -Seconds 2
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "  Installation completed successfully!" -ForegroundColor Green
    Write-Host "  Look for the ACE icon in the system" -ForegroundColor Green
    Write-Host "  tray (bottom right corner)." -ForegroundColor Green
    Write-Host "  ACE will start automatically with Windows." -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Failed to import dependencies:" -ForegroundColor Red
    Write-Host $TestResult -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run manually to see the full error:" -ForegroundColor Yellow
    Write-Host "  $PythonEx $AcePy" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
