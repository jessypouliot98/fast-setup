import { PackageBuilder, type PackageInstallArgs, type PackageInstallReturnCode } from "../utils/PackageBuilder.tsx";
import { $ } from "bun"

const FAST_SETUP_TMP_DIR = "$HOME/.fast-setup-tmp";
const FAST_SETUP_ASK_PASS_SCRIPT_PATH = `${FAST_SETUP_TMP_DIR}/ask-pass.sh`;
const FAST_SETUP_ASK_PASS_ENV = "FAST_SETUP_ASK_PASS_ANSWER";

async function brewInstall(pkg: string, args: PackageInstallArgs): Promise<PackageInstallReturnCode> {
  const check = await $`brew list | grep ${pkg}`.text();
  if (check.includes(pkg)) {
    return "already-installed";
  }

  const result = await $`brew install ${pkg}`.env({
    ...process.env,
    SUDO_ASKPASS: FAST_SETUP_ASK_PASS_SCRIPT_PATH.replace("$HOME", args.homePath),
    [FAST_SETUP_ASK_PASS_ENV]: args.sudoPassword,
  });
  return result.exitCode === 0 ? "installed" : "error";
}

async function zshAddLine(line: string) {
  const check = await $`cat $HOME/.zshrc`.text();
  if (check.includes(line)) {
    return;
  }

  return $`echo ${line} > $HOME/.zshrc`;
}

async function ohMyZshAddPlugin(pluginName: string) {
  return zshAddLine(`plugins=(${pluginName})`);
}

export default new PackageBuilder()
  .addCoreOption(
    "Temporary | Ask password overrider",
    { dependsOn: [] },
    async ({ sudoPassword }) => {
      await $`mkdir -p ${{ raw: FAST_SETUP_TMP_DIR }}`;
      await $`echo "#!/bin/bash\necho \\"\\$${{ raw: FAST_SETUP_ASK_PASS_ENV }}\\";" > ${{ raw: FAST_SETUP_ASK_PASS_SCRIPT_PATH }}`;
      await $`chmod a+x ${{ raw: FAST_SETUP_ASK_PASS_SCRIPT_PATH }}`;
      console.log({
        FAST_SETUP_ASK_PASS_ENV,
        envPassword: await $`echo $FAST_SETUP_ASK_PASS_ANSWER`.env({
          [FAST_SETUP_ASK_PASS_ENV]: sudoPassword
        }).text(),
        sudoPassword,
      })

      return "installed";
    }
  )
  // .addPostInstallCallback(async () => {
  //   await $`rm -rf ${{ raw: FAST_SETUP_TMP_DIR }}`
  // })
  .addCoreOption(
    "Oh My Zsh",
    { dependsOn: [] },
    async (args) => {
      const check = await $`ls -a $HOME | grep .oh-my-zsh`.text();
      if (check.includes("oh-my-zsh")) {
        return "already-installed";
      }

      const result = await $`sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
      return result.exitCode === 0 ? "installed" : "error";
    },
  )
  .addCoreOption(
    "Homebrew",
    { dependsOn: [] },
    async ({ sudoPassword }) => {
      const check = await $`which brew`.text();
      if (!check.includes("not found")) {
        return "already-installed";
      }

      const result = await $`echo ${sudoPassword} | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`;
      return result.exitCode === 0 ? "installed" : "error";
    }
  )
  .addCoreOption(
    "wget",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("wget", args),
  )
  .addCoreOption(
    "git",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("wget", args),
  )
  .addCoreOption(
    "coreutils",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("coreutils", args),
  )
  .addOption(
    "Browser | Google Chrome",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("google-chrome", args),
  )
  .addOption(
    "Browser | Firefox",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("firefox", args),
  )
  .addOption(
    "Communication | Discord",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("discord", args),
  )
  .addOption(
    "Communication | Slack",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("slack", args),
  )
  .addOption(
    "Communication | Microsoft Teams",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("microsoft-teams", args),
  )
  .addOption(
    "Utility | Hotkey",
    { dependsOn: [] },
    async (args) => {
      const check = await $`ls /Applications | grep HotKey.app`.text()
      if (check.includes("HotKey")) {
        return "already-installed";
      }

      await $`open https://apps.apple.com/us/app/hotkey-app/id975890633`;
      return "installed";
    },
  )
  .addOption(
    "Utility | Rectangle",
    { dependsOn: [] },
    async (args) => brewInstall("rectangle", args),
  )
  .addOption(
    "Developer | ASDF Version Manager",
    { dependsOn: ["coreutils", "Oh My Zsh", "git"] },
    async (args) => {
      const check = await $`which asdf`.text();
      if (!check.includes("not found")) {
        return "already-installed";
      }

      const result = await $`git clone https://github.com/asdf-vm/asdf.git $HOME/.asdf --branch v0.14.0`
      if (result.exitCode !== 0) {
        return "error";
      }

      await ohMyZshAddPlugin("asdf")
      return "installed"
    },
  )
  .addOption(
    "Developer | Jetbrains Toolbox",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("jetbrains-toolbox", args),
  )
  .addOption(
    "Developer | Visual Studio Code",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("visual-studio-code", args),
  )
  .addOption(
    "Developer | Git LFS",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("git-lfs", args),
  )
  .addOption(
    "Entertainment | Steam",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("steam", args),
  )
  .addOption(
    "Entertainment | Playstation Remote Play",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("sony-ps-remote-play", args),
  )
  .addOption(
    "Entertainment | Parsec",
    { dependsOn: ["Homebrew"] },
    async (args) => brewInstall("parsec", args),
  )
  .addOption(
    "Developer | ASDF Plugin Node",
    { dependsOn: ["Developer | ASDF Version Manager"] },
    async (args) => {
      const check = await $`asdf list | grep node`.text();
      if (check.includes("node")) {
        return "already-installed";
      }

      const result = await $`asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git`;
      if (result.exitCode !== 0) {
        return "error";
      }

      await $`asdf install nodejs latest`;
      await $`asdf global nodejs latest`;

      return "installed"
    },
  )
  .addOption(
    "Developer | ASDF Plugin Java",
    { dependsOn: ["Developer | ASDF Version Manager"] },
    async (args) => {
      const check = await $`asdf list | grep java`.text();
      if (check.includes("java")) {
        return "already-installed";
      }

      const result = await $`asdf plugin-add java https://github.com/halcyon/asdf-java.git`;
      if (result.exitCode !== 0) {
        return "error";
      }

      await $`asdf install java latest:adoptopenjdk-11`;
      await $`asdf global java latest:adoptopenjdk-11`;
      await zshAddLine(". $HOME/.asdf/plugins/java/set-java-home.zsh");
      await $`echo java_macos_integration_enable=yes > $HOME/.asdfrc`;

      return "installed";
    },
  )
  .addOption(
    "Developer | Bun JavaScript",
    { dependsOn: [] },
    async (args) => {
      const check = await $`which bun`.text();
      if (!check.includes("not found")) {
        return "already-installed";
      }

      const result = await $`curl -fsSL https://bun.sh/install | bash`;
      return result.exitCode === 0 ? "installed" : "error";
    },
  )
  .addOption(
    "Developer | Podman (Free Docker alternative)",
    { dependsOn: ["Homebrew"] },
    async (args) => {
      const check = await $`which podman`.text();
      if (!check.includes("not found")) {
        return "already-installed";
      }

      const result = await $`brew install podman-desktop`;
      if (result.exitCode !== 0) {
        return "error";
      }

      const cliEmulator = `
#!/usr/bin/env sh
[ -e /etc/containers/nodocker ] || \\
echo "Emulate Docker CLI using podman. Create /etc/containers/nodocker to quiet msg." >&2
exec podman "$@"
      `.trim();
      await $`echo ${cliEmulator} > /usr/local/bin/docker`

      return "installed";
    },
  )
