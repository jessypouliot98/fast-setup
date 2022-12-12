#!/usr/bin/env bash

echo "Setup for Ubuntu Linux"

preSetup() {
  sudo apt update
  sudo apt upgrade -y
}

installZsh() {
  sudo apt install zsh
}

installOhMyZsh() {
  sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
}

installFastEnv() {
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/jessypouliot98/fast-env/master/install.sh)"
}

installVSCode() {
  sudo apt install code
}

installChrome() {
  sudo apt install google-chrome-stable
}

installNodeVersionManager() {
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
}

installTablePlus() {
  sudo apt install software-properties-common
  wget -qO - https://deb.tableplus.com/apt.tableplus.com.gpg.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/tableplus-archive.gpg
  sudo add-apt-repository "deb [arch=amd64] https://deb.tableplus.com/debian/22 tableplus main"
  sudo apt update
  sudo apt install tableplus
}

postSetup() {
  echo ""
  echo "Resource terminal and then"
  echo "- run \`nvm install --lts\`"
}

preSetup
installZsh
installOhMyZsh
installFastEnv
installVSCode
installNodeVersionManager
installTablePlus
postSetup
