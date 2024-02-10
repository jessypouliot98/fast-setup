import Enquirer from "enquirer";
import {
  asdfAddPluginJava,
  asdfAddPluginNode,
  brewInstall,
  installASDF,
  installGoogleChrome,
  installHomebrew, installHotkey,
  installOhMyZsh, installRectangle,
  installVSCode,
} from "./src/packages.ts";
const { prompt } = Enquirer;

const PACKAGE = {
  "Google Chrome": { dependsOn: ["wget"] },
  "Rectangle": { dependsOn: ["wget"] },
  "Hotkey": { dependsOn: [] },
  "Visual Studio Code": { dependsOn: ["wget"] },
  "Jetbrains Toolbox": { dependsOn: [] },
  "Jetbrains Webstorm": { dependsOn: [] },
  "Jetbrains Android Studio": { dependsOn: [] },
  "ASDF Version Manager": { dependsOn: ["Oh My Zsh", "git", "coreutils", "curl"] },
  "ASDF Plugin Node": { dependsOn: ["ASDF Version Manager"] },
  "ASDF Plugin Java": { dependsOn: ["ASDF Version Manager"] },
  "Oh My Zsh": { dependsOn: [] },
  "Homebrew": { dependsOn: [] },
  "wget": { dependsOn: ["Homebrew"] },
  "git": { dependsOn: ["Homebrew"] },
  "coreutils": { dependsOn: ["Homebrew"] },
  "curl": { dependsOn: ["Homebrew"] },
} satisfies Record<string, { dependsOn: string[] }>
type PACKAGE = keyof typeof PACKAGE;

async function main() {
  const { packages: selectedPackages }: { packages: Array<PACKAGE> } = await prompt({
    type: "multiselect",
    name: "packages",
    message: "Select packages you want to install",
    choices: Object.keys(PACKAGE) as Array<PACKAGE>,
    required: true,
  });
  const { password }: { password: string } = await prompt({
    type: "password",
    name: "password",
    message: "Insert sudo password",
    required: true,
  })

  await installPackages(password, selectedPackages);
}

async function installPackages(sudoPassword: string, packages: PACKAGE[], installedPkgs: Set<PACKAGE> = new Set) {
  for (const pkg of packages) {
    if (PACKAGE[pkg].dependsOn.length > 0) {
      await installPackages(
        sudoPassword,
        PACKAGE[pkg].dependsOn as PACKAGE[],
        installedPkgs
      )
    }

    if (installedPkgs.has(pkg)) {
      continue;
    }

    let didInstall = true;
    console.log(`Installing ${pkg}...`);
    switch (pkg) {
      case "Google Chrome": {
        await installGoogleChrome(sudoPassword);
        break;
      }
      case "Visual Studio Code": {
        await installVSCode();
        break;
      }
      case "Rectangle": {
        await installRectangle(sudoPassword);
        break;
      }
      case "Hotkey": {
        await installHotkey();
        break;
      }
      case "Homebrew": {
        await installHomebrew(sudoPassword);
        break;
      }
      case "wget": {
        await brewInstall("wget");
        break;
      }
      case "git": {
        await brewInstall("git");
        break;
      }
      case "curl": {
        await brewInstall("curl");
        break;
      }
      case "coreutils": {
        await brewInstall("coreutils");
        break;
      }
      case "Oh My Zsh": {
        await installOhMyZsh();
        break;
      }
      case "ASDF Version Manager": {
        await installASDF();
        break;
      }
      case "ASDF Plugin Node": {
        await asdfAddPluginNode();
        break;
      }
      case "ASDF Plugin Java": {
        await asdfAddPluginJava();
        break;
      }
      default: {
        didInstall = false;
        console.warn(`${pkg} has no install case`)
      }
    }

    if (didInstall) {
      console.log(`${pkg} was installed`);
      installedPkgs.add(pkg);
    }
  }
}

await main();