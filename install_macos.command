#!/bin/bash
cd "$(dirname "$0")"

echo "======================================"
echo "Installing ACE (A Cuanto Esta) on macOS"
echo "======================================"

if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install Python 3 (e.g. using brew install python)."
    exit 1
fi

echo "-> Creating virtual environment..."
python3 -m venv venv

echo "-> Installing dependencies..."
source venv/bin/activate
pip install -r requirements.txt

echo "-> Configuring background auto-start (LaunchAgent)..."
mkdir -p "$HOME/Library/LaunchAgents"
PLIST_PATH="$HOME/Library/LaunchAgents/dev.serverket.ace.plist"

cat <<EOF > "$PLIST_PATH"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>dev.serverket.ace</string>
    <key>ProgramArguments</key>
    <array>
        <string>$PWD/venv/bin/python3</string>
        <string>$PWD/ace.py</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>$PWD</string>
</dict>
</plist>
EOF

# Unload if it already exists, then load
launchctl unload "$PLIST_PATH" 2>/dev/null
launchctl load "$PLIST_PATH"

echo "-> Installation completed successfully."
echo "ACE will run automatically in the Menu Bar every time you start your Mac."
echo "Starting service..."
launchctl start dev.serverket.ace

echo "You can now close this window."
