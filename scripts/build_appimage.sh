#!/bin/bash
# ACE AppImage Builder Script
# This script bundles ACE into a single AppImage.

set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/build_appimage.sh <version>"
  echo "Example: ./scripts/build_appimage.sh v1.1.0"
  exit 1
fi

VERSION=$1
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

echo "🚀 Building ACE $VERSION AppImage..."

# 1. Activate venv and install pyinstaller if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv --system-site-packages venv
fi
source venv/bin/activate
pip install pyinstaller -q

# 2. Build single executable with PyInstaller
echo "📦 Compiling ace.py with PyInstaller..."
rm -rf build/ dist/ ace.spec
pyinstaller --onefile --windowed \
    --hidden-import gi.repository.Gtk \
    --hidden-import gi.repository.AyatanaAppIndicator3 \
    --name ace ace.py

# 3. Setup AppDir
APPDIR="ACE.AppDir"
echo "📁 Setting up $APPDIR..."
rm -rf "$APPDIR"
mkdir -p "$APPDIR/usr/bin"
mkdir -p "$APPDIR/usr/share/applications"
mkdir -p "$APPDIR/usr/share/icons/hicolor/256x256/apps"

# Copy binary
cp dist/ace "$APPDIR/usr/bin/ace"
chmod +x "$APPDIR/usr/bin/ace"

# Create .desktop file
cat > "$APPDIR/ace.desktop" << 'EOF'
[Desktop Entry]
Type=Application
Name=ACE
Comment=Widget ACE - A Cuanto Esta
Exec=ace
Icon=ace
Categories=Utility;Finance;
Terminal=false
EOF
cp "$APPDIR/ace.desktop" "$APPDIR/usr/share/applications/"

# Use official logo for the AppImage
cp "assets/logo.svg" "$APPDIR/ace.svg"
# Copy to standard icon path (most DEs will pick up SVG)
cp "$APPDIR/ace.svg" "$APPDIR/usr/share/icons/hicolor/256x256/apps/"
ln -s ace.svg "$APPDIR/.DirIcon" || true

# Create AppRun script
cat > "$APPDIR/AppRun" << 'EOF'
#!/bin/sh
HERE="$(dirname "$(readlink -f "${0}")")"
export PATH="${HERE}/usr/bin:${PATH}"
exec ace "$@"
EOF
chmod +x "$APPDIR/AppRun"

# 4. Download AppImage runtime if not present
if [ ! -f "runtime-x86_64" ]; then
    echo "⬇️ Downloading AppImage runtime..."
    wget -qO runtime-x86_64 "https://github.com/AppImage/AppImageKit/releases/download/continuous/runtime-x86_64"
fi

# 5. Build AppImage (Native mksquashfs, 0 caveats, no segfaults)
echo "⚙️ Packaging AppImage via mksquashfs..."
mksquashfs "$APPDIR" ace.squashfs -root-owned -noappend -comp xz -quiet
cat runtime-x86_64 ace.squashfs > "ACE-${VERSION}-x86_64.AppImage"
chmod +x "ACE-${VERSION}-x86_64.AppImage"

# Cleanup
rm -rf ACE.AppDir ace.squashfs

echo "✅ Success! Built ACE-${VERSION}-x86_64.AppImage"
