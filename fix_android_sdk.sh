#!/bin/bash

# Official Android SDK Fix for Kali Linux
# This script downloads the official Google Command Line Tools to a local folder

# 1. Setup Local SDK Folder
SDK_DIR="$HOME/android-sdk-official"
mkdir -p "$SDK_DIR"
cd "$SDK_DIR"

echo "🚀 Downloading Official Google Android Tools..."
# Download latest cmdline-tools for Linux
curl -o cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip

echo "📦 Unzipping tools..."
unzip -q cmdline-tools.zip
mkdir -p cmdline-tools/latest
# Move contents to follow the required structure: cmdline-tools/latest/bin...
mv cmdline-tools/bin cmdline-tools/latest/
mv cmdline-tools/lib cmdline-tools/latest/
mv cmdline-tools/source.properties cmdline-tools/latest/
mv cmdline-tools/NOTICE.txt cmdline-tools/latest/

echo "🔑 Accepting Licenses..."
# Use the official sdkmanager to accept licenses
yes | cmdline-tools/latest/bin/sdkmanager --sdk_root="$SDK_DIR" --licenses

echo "🛠️ Installing required Build-Tools & Platforms..."
cmdline-tools/latest/bin/sdkmanager --sdk_root="$SDK_DIR" "platform-tools" "platforms;android-35" "build-tools;34.0.0"

echo "📝 Updating project configuration..."
# Update the local.properties in the android project
echo "sdk.dir=$SDK_DIR" > "$HOME/Vendora/vendora/android/local.properties"

echo "✅ DONE! Your SDK is now ready in $SDK_DIR"
echo "You can now run: cd $HOME/Vendora/vendora/android && ./gradlew assembleDebug"
