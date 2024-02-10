import { $ } from "bun";

export async function brewInstall(pkg: string) {
  return $`brew install ${pkg}`;
}

export async function zshAddLine(line: string) {
  return $`echo ${line} > ~/.zshrc`;
}

export async function ohMyZshAddPlugin(pluginName: string) {
  return zshAddLine(`plugins=(${pluginName})`);
}

export async function installGoogleChrome(sudoPassword: string) {
  const srcFile = "./chrome.dmg";
  await $`wget https://dl.google.com/chrome/mac/universal/stable/GGRO/googlechrome.dmg -O ${srcFile}`
  await $`echo ${sudoPassword} | sudo -S hdiutil attach ${srcFile}`
  await $`echo ${sudoPassword} | sudo -S cp -R "/Volumes/Google Chrome/Google Chrome.app" /Applications`
  await $`rm ${srcFile}`
}

export async function installVSCode() {
  const srcZip = "./vscode.zip";
  await $`wget https://az764295.vo.msecnd.net/stable/c722ca6c7eed3d7987c0d5c3df5c45f6b15e77d1/VSCode-darwin-universal.zip -O ${srcZip}`
  await $`echo "n" | unzip ${srcZip} -d /Applications`
  await $`rm ${srcZip}`
}

export async function installRectangle(sudoPassword: string) {
  const srcFile = "./rectangle.dmg";
  await $`wget https://github.com/rxhanson/Rectangle/releases/download/v0.75/Rectangle0.75.dmg -O ${srcFile}`
  await $`echo ${sudoPassword} | sudo -S hdiutil attach ${srcFile}`
}

export async function installHotkey() {
  await $`open https://apps.apple.com/us/app/hotkey-app/id975890633`;
}

export async function installHomebrew(sudoPassword: string) {
  return $`echo ${sudoPassword} | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`;
}

export async function installOhMyZsh() {
  return $`sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`;
}

export async function installASDF() {
  await $`git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0`
  await ohMyZshAddPlugin("asdf")
}

export async function asdfAddPluginNode() {
  await $`asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git`;
  await $`asdf install nodejs latest`;
  await $`asdf global nodejs latest`;
}

export async function asdfAddPluginJava() {
  await $`asdf plugin-add java https://github.com/halcyon/asdf-java.git`;
  await $`asdf install java latest:adoptopenjdk-11`;
  await $`asdf global java latest:adoptopenjdk-11`;
  await zshAddLine(". ~/.asdf/plugins/java/set-java-home.zsh");
  await $`echo java_macos_integration_enable=yes > .asdfrc`;
}