import { PackageBuilder, type PackageInstallArgs, type PackageInstallReturnCode } from "../utils/PackageBuilder.tsx";
import { $ } from "bun";

async function wingetInstall(pkg: string, args: PackageInstallArgs): Promise<PackageInstallReturnCode> {
  await $`winget install ${pkg}`;
  return "installed";
}

export default new PackageBuilder()
  .addCoreOption(
    "winget",
    { dependsOn: [] },
    async () => "already-installed",
  )
  .addOption(
    "Entertainment | Steam",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("Valve.Steam", args)
  )
  .addOption(
    "Entertainment | Epic Games",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("EpicGames.EpicGamesLauncher", args)
  )
  .addOption(
    "Entertainment | Ubisoft Connect",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("Ubisoft.Connect", args)
  )
  .addOption(
    "Entertainment | PlayStation RemotePlay",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("PlayStation.PSRemotePlay", args)
  )
  .addOption(
    "Entertainment | League of Legends",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("RiotGames.LeagueOfLegends.NA", args)
  )
  .addOption(
    "Entertainment | Parsec",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("Parsec.Parsec", args)
  )
  .addOption(
    "Entertainment | Spotify",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("Spotify", args)
  )
  .addOption(
    "Communication | Discord",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("Discord.Discord", args)
  )
  .addOption(
    "Browser | Google Chrome",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("Google.Chrome", args)
  )
  .addOption(
    "Utility | 7zip",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("7zip.7zip", args)
  )
  .addOption(
    "Developer | Terminal",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("Microsoft.WindowsTerminal", args)
  )
  .addOption(
    "Developer | Visual Studio Code",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("Microsoft.VisualStudioCode", args)
  )
  .addOption(
    "Developer | Table Plus",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("TablePlus.TablePlus", args)
  )
  .addOption(
    "Developer | Docker",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("Docker.DockerDesktop", args)
  )
  .addOption(
    "Developer | Node.js",
    { dependsOn: ["winget"] },
    async (args) => wingetInstall("OpenJS.NodeJS", args)
  )