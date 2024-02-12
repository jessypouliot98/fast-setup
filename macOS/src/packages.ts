import { $ } from "bun";

export async function brewInstall(pkg: string) {
  const check = await $`brew list | grep ${pkg}`.text();
  if (check.includes(pkg)) {
    console.log(`${pkg} is already installed`);
    return;
  }

  return $`brew install ${pkg}`;
}

export async function zshAddLine(line: string) {
  const check = await $`cat $HOME/.zshrc`.text();
  if (check.includes(line)) {
    return;
  }

  return $`echo ${line} > $HOME/.zshrc`;
}

export async function ohMyZshAddPlugin(pluginName: string) {
  return zshAddLine(`plugins=(${pluginName})`);
}

export async function installGoogleChrome(sudoPassword: string) {
  const check = await $`ls /Applications | grep "Google Chrome.app"`.text()
  if (check.includes("Google Chrome.app")) {
    console.log("Google Chrome.app is already installed.")
    return;
  }

  const srcFile = "./chrome.dmg";
  await $`wget https://dl.google.com/chrome/mac/universal/stable/GGRO/googlechrome.dmg -O ${srcFile}`
  await $`echo ${sudoPassword} | sudo -S hdiutil attach ${srcFile}`
  await $`echo ${sudoPassword} | sudo -S cp -R "/Volumes/Google Chrome/Google Chrome.app" /Applications`
  await $`rm ${srcFile}`
}

export async function installVSCode() {
  const check = await $`ls /Applications | grep "Visual Studio Code.app"`.text()
  if (check.includes("Visual Studio Code.app")) {
    console.log("Visual Studio Code.app is already installed.")
    return;
  }

  const srcZip = "./vscode.zip";
  await $`wget https://az764295.vo.msecnd.net/stable/c722ca6c7eed3d7987c0d5c3df5c45f6b15e77d1/VSCode-darwin-universal.zip -O ${srcZip}`
  await $`echo "n" | unzip ${srcZip} -d /Applications`
  await $`rm ${srcZip}`
}

export async function installJetbrainsToolbox(sudoPassword: string) {
  const check = await $`ls /Applications | grep "JetBrains Toolbox.app"`.text()
  if (check.includes("JetBrains Toolbox.app")) {
    console.log("Jetbrains Toolbox.app is already installed.")
    return;
  }

  await $`open -a "Safari" "https://www.jetbrains.com/toolbox-app"`
}

export async function installRectangle(sudoPassword: string) {
  const check = await $`ls /Applications | grep Rectangle.app`.text()
  if (check.includes("Rectangle")) {
    console.log("Rectangle.app is already installed.")
    return;
  }

  const srcFile = "./rectangle.dmg";
  await $`wget https://github.com/rxhanson/Rectangle/releases/download/v0.75/Rectangle0.75.dmg -O ${srcFile}`
  await $`echo ${sudoPassword} | sudo -S hdiutil attach ${srcFile}`
  await $`echo ${sudoPassword} | sudo -S cp -R "/Volumes/Rectangle0.75/Rectangle.app" /Applications`
  await $`rm ${srcFile}`
}

export async function installHotkey() {
  const check = await $`ls /Applications | grep HotKey.app`.text()
  if (check.includes("HotKey")) {
    console.log("HotKey.app is already installed.")
    return;
  }

  await $`open https://apps.apple.com/us/app/hotkey-app/id975890633`;
}

export async function installHomebrew(sudoPassword: string) {
  const check = await $`which brew`.text();
  if (!check.includes("not found")) {
    console.log("Homebrew is already installed")
    return;
  }

  return $`echo ${sudoPassword} | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`;
}

export async function installOhMyZsh() {
  const check = await $`ls -a $HOME | grep .oh-my-zsh`.text();
  console.log({check})
  if (check.includes("oh-my-zsh")) {
    console.log("oh-my-zsh is already installed")
    return;
  }

  return $`sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`;
}

export async function installBun() {
  const check = await $`which bun`.text();
  if (!check.includes("not found")) {
    console.log("Bun is already installed")
    return;
  }

  await $`curl -fsSL https://bun.sh/install | bash`;
}

export async function installASDF() {
  const check = await $`which asdf`.text();
  if (!check.includes("not found")) {
    console.log("ASDF is already installed")
    return;
  }

  await brewInstall("coreutils");
  await $`git clone https://github.com/asdf-vm/asdf.git $HOME/.asdf --branch v0.14.0`
  await ohMyZshAddPlugin("asdf")
}

export async function asdfAddPluginNode() {
  const check = await $`asdf list | grep node`.text();
  if (check.includes("node")) {
    console.log("asdf plugin node is already installed")
    return;
  }

  await $`asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git`;
  await $`asdf install nodejs latest`;
  await $`asdf global nodejs latest`;
}

export async function asdfAddPluginJava() {
  const check = await $`asdf list | grep java`.text();
  if (check.includes("java")) {
    console.log("asdf plugin java is already installed")
    return;
  }

  await $`asdf plugin-add java https://github.com/halcyon/asdf-java.git`;
  await $`asdf install java latest:adoptopenjdk-11`;
  await $`asdf global java latest:adoptopenjdk-11`;
  await zshAddLine(". $HOME/.asdf/plugins/java/set-java-home.zsh");
  await $`echo java_macos_integration_enable=yes > $HOME/.asdfrc`;
}