#!/bin/bash
# Solarmax-style automated dynamic versioning release script

set -e

# Change to the root directory of the project
cd "$(dirname "$0")/.."

if [ -z "$1" ]; then
  echo "Usage: ./scripts/release.sh <new_version> [--note \"message\"]"
  echo "Example: ./scripts/release.sh v1.0.1"
  exit 1
fi

VERSION=$1
shift

# Check if version has 'v' prefix, if not, add it
if [[ ! $VERSION == v* ]]; then
  VERSION="v$VERSION"
fi

# Validate that the version tag follows vX.X.X format
if [[ ! $VERSION =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Error: Version must follow format vX.X.X or X.X.X"
  exit 1
fi

NOTE=""
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --note|-m) NOTE="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

echo "🚀 Preparing release for $VERSION"

# Update the internal versioning in the source code
sed -i "s/__version__ = \".*\"/__version__ = \"$VERSION\"/g" ace.py

# Update the versioning in READMEs
sed -i -E "s/ACE-v[0-9]+\.[0-9]+\.[0-9]+-x86_64\.AppImage/ACE-${VERSION}-x86_64\.AppImage/g" README.md README.es.md
sed -i -E "s/\*\*Version\*\*: v[0-9]+\.[0-9]+\.[0-9]+/\*\*Version\*\*: ${VERSION}/g" README.md README.es.md

# Update the version in web/package.json and root package.json (stripping the 'v' prefix for valid semver)
SEMVER="${VERSION#v}"
sed -i -E "s/\"version\": \"[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"${SEMVER}\"/g" web/package.json
sed -i -E "s/\"version\": \"[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"${SEMVER}\"/g" package.json

# Build the AppImage (this will generate the binary and take a moment)
echo "📦 Calling build_appimage.sh..."
chmod +x scripts/build_appimage.sh
./scripts/build_appimage.sh "$VERSION"

# Build the Web App PWA
echo "🌐 Building Web App for PWA deployment..."
cd web
bun run build
cd ..

# Create git tag
git add .
if [ -n "$NOTE" ]; then
  git commit -m "chore(release): $VERSION - $NOTE" || echo "No changes to commit"
  git tag -a $VERSION -m "$NOTE"
else
  git commit -m "chore(release): bump version to $VERSION" || echo "No changes to commit"
  git tag $VERSION
fi

echo "✅ Successfully created local tag $VERSION."
echo "💡 To push this release, run: git push origin main --tags"
