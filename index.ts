import macOS from "./src/packages/macOS.ts";
import windows from "./src/packages/windows.ts";

import Enquirer from "enquirer";
import type { PackageInstallArgs } from "./src/utils/PackageBuilder.tsx";
import { $ } from "bun";

async function getOS() {
  const osType = await $`echo $OSTYPE`.text();
  if (osType.includes("darwin")) {
    return "macOS";
  }
  if (osType.includes("linux")) {
    return "linux";
  }
  if (osType.includes("win32")) {
    return "windows";
  }
  throw new Error(`${osType} is unsupported`);
}

async function main() {
  const OS = await getOS();

  switch (OS) {

    case "macOS": {
      const homePath = (await $`echo $HOME`.text()).trim();
      const args: Pick<PackageInstallArgs, "sudoPassword"> = await Enquirer.prompt([
        {
          type: "password",
          name: "sudoPassword",
          message: "Enter password for sudo commands",
        }
      ]);
      await macOS.promptAndInstallPackages({
        ...args,
        homePath,
      });
      break;
    }

    case "windows": {
      await windows.promptAndInstallPackages({
        sudoPassword: "n/a",
        homePath: "n/a",
      });
      break;
    }

    case "linux": {
      console.warn("Linux not implemented yet");
      break;
    }

  }
}

await main();