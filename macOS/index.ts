import Enquirer from "enquirer";
import {
  asdfAddPluginJava,
  asdfAddPluginNode,
  brewInstall,
  installASDF, installBun,
  installGoogleChrome,
  installHomebrew, installHotkey, installJetbrainsToolbox,
  installOhMyZsh, installRectangle,
  installVSCode,
} from "./src/packages.ts";
import { $ } from "bun";
const { prompt } = Enquirer;

const PACKAGE = {
  "Google Chrome": { dependsOn: ["wget"] },
  "Rectangle": { dependsOn: ["wget"] },
  "Hotkey": { dependsOn: [] },
  "Visual Studio Code": { dependsOn: ["wget"] },
  "Jetbrains Toolbox": { dependsOn: [] },
  "ASDF Version Manager": { dependsOn: ["Oh My Zsh", "git"] },
  "ASDF Plugin Node": { dependsOn: ["ASDF Version Manager"] },
  "ASDF Plugin Java": { dependsOn: ["ASDF Version Manager"] },
  "Bun Javascript": { dependsOn: [] },
  "Oh My Zsh": { dependsOn: [] },
  "Homebrew": { dependsOn: [] },
  "wget": { dependsOn: ["Homebrew"] },
  "git": { dependsOn: ["Homebrew"] },
} satisfies Record<string, { dependsOn: string[] }>
type PACKAGE = keyof typeof PACKAGE;

async function main() {
  const { sudoPassword }: { sudoPassword: string } = await prompt({
    type: "password",
    name: "sudoPassword",
    message: "Insert sudo password",
  })

  await selectPackages(sudoPassword);
  await configureGit();
}

async function configureGit() {
  const configCheck = await $`cat $HOME/.gitconfig`.text();
  if (!configCheck.includes("No such file or directory")) {
    const { shouldOverwrite }: { shouldOverwrite: boolean } = await prompt({
      type: "confirm",
      name: "shouldOverwrite",
      message: "A previous git config was found, should we overwrite it?",
      initial: false,
    })
    if (!shouldOverwrite) {
      return;
    }
  }

  const form: { name: string; email: string; signingKey: string } = await prompt([
    {
      type: "text",
      name: "name",
      message: "Git user.name",
    },
    {
      type: "text",
      name: "email",
      validate: (v) => v.length > 5 && v.includes("@"),
      message: "Git user.email",
    },
    {
      type: "text",
      name: "signingKey",
      message: "Git ssh key path",
      initial: `~/.ssh/id_rsa.pub`,
    }
  ]);

  const sshCheck = await $`cat ${form.signingKey.replace("~", "$HOME")}`.text();
  if (!sshCheck.includes("No such file or directory")) {
    console.log(`No ssh key found at ${form.signingKey}. Please generate one for the configuration to work properly`);
    console.log(`RUN: 'ssh-keygen -f ${form.signingKey}'`)
  }

  let gitConfig = [
    "[user]",
    `\tname = ${form.name}`,
    `\temail = ${form.email}`,
    `\tsigningKey = ${form.signingKey}`,
    "[gpg]",
    "\tformat = ssh",
    "[commit]",
    "\tgpgsign = true"
  ].join("\n");
  await $`echo ${gitConfig} > $HOME/.gitconfig`;
}

async function selectPackages(sudoPassword: string) {
  const { packages: selectedPackages }: { packages: Array<PACKAGE> } = await prompt({
    type: "multiselect",
    name: "packages",
    message: "Select packages you want to install",
    choices: Object.keys(PACKAGE) as Array<PACKAGE>,
  });
  await installPackages(sudoPassword, selectedPackages);
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
      case "Jetbrains Toolbox": {
        await installJetbrainsToolbox();
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
      case "Bun Javascript": {
        await installBun();
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