#!/usr/bin/env bash

echo "Setup for MacOS"

TEMP_DIR=./tmp

installHomebrew () {
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
}

installNodeVersionManager () {
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
}

installTiles () {
  SOURCE_FILE="$TEMP_DIR/tiles.dmg"
  wget https://updates.sempliva.com/tiles/Tiles-latest.dmg -O $SOURCE_FILE
  sudo hdiutil attach $SOURCE_FILE
  sudo cp -R /Volumes/Tiles/Tiles.app /Applications
  rm $SOURCE_FILE
}

installVSCode () {
  SOURCE_ZIP="$TEMP_DIR/vscode.zip"
  wget https://az764295.vo.msecnd.net/stable/c722ca6c7eed3d7987c0d5c3df5c45f6b15e77d1/VSCode-darwin-universal.zip -O $SOURCE_ZIP
  unzip $SOURCE_ZIP -d /Applications
  rm $SOURCE_ZIP
}

installFastEnv () {
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/jessypouliot98/fast-env/master/install.sh)"
}

installHotkeyApp () {
  open https://apps.apple.com/us/app/hotkey-app/id975890633
}

installChromeApp () {
  SOURCE_FILE="$TEMP_DIR/chrome.dmg"
  wget https://dl.google.com/chrome/mac/universal/stable/GGRO/googlechrome.dmg -O $SOURCE_FILE
  sudo hdiutil attach $SOURCE_FILE
  sudo cp -R "/Volumes/Google Chrome/Google Chrome.app" /Applications
  rm $SOURCE_FILE
}

installChromeApp
installTiles
installVSCode
installHotkeyApp
installHomebrew
installNodeVersionManager
installFastEnv
