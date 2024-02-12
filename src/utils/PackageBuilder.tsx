import Enquirer from "enquirer";

export type PackageInstallArgs = {
  sudoPassword: string;
  homePath: string;
}

export type PackageInstallReturnCode = "installed" | "already-installed" | "error"

export type PackageInstallFn = (args: PackageInstallArgs) => Promise<PackageInstallReturnCode>;

export class PackageBuilder<TOptions extends Array<string> = []> {

  private postInstallCallbacks = new Set<() => Promise<void>>();
  private coreOptions = new Set<TOptions[number]>();
  private options = new Map<TOptions[number], PackageInstallFn>();

  public addOption<TPackageName extends string>(packageName: TPackageName, options: { dependsOn: Array<TOptions[number]> }, installCb: PackageInstallFn) {
    if (this.options.has(packageName)) {
      throw new Error(`Cannot add package option ${packageName}. It is already defined.`);
    }
    options.dependsOn.forEach((dependency) => {
      if (!this.options.has(dependency)) {
        throw new Error(`Package ${packageName} depends on ${dependency} but it was not defined.`)
      }
    })

    this.options.set(packageName, installCb);
    return this as unknown as PackageBuilder<[...TOptions, TPackageName]>
  }

  public addCoreOption<TPackageName extends string>(packageName: TPackageName, options: { dependsOn: Array<TOptions[number]> }, installCb: PackageInstallFn) {
    const self = this.addOption(packageName, options, installCb);
    this.coreOptions.add(packageName);
    return self;
  }

  public addPostInstallCallback(cb: () => Promise<void>) {
    this.postInstallCallbacks.add(cb);
    return this;
  }

  public async prompt() {
    const choices = Array.from(this.options.keys()).filter((pkg) => !this.coreOptions.has(pkg)).sort();
    const result: { packageToInstall: Array<TOptions[number]> } = await Enquirer.prompt({
      type: "multiselect",
      name: "packageToInstall",
      message: "Select packages to install",
      choices,
    });

    return [...Array.from(this.coreOptions), ...result.packageToInstall];
  }

  public async installPackages(packages: Array<TOptions[number]>, args: PackageInstallArgs) {
    for (const pkg of packages) {
      console.log(`Installing ${pkg}...`)

      const installFn = this.options.get(pkg);

      if (!installFn) {
        console.error(`[Error] Could not install ${pkg}, install function is not defined`);
        continue;
      }

      const result = await installFn(args);
      switch (result) {
        case "installed": {
          console.log(`[Done] ${pkg} installed!`);
          break;
        }
        case "already-installed": {
          console.log(`[Skip] ${pkg} already installed.`);
          break;
        }
        case "error": {
          console.log(`[Error] Could not install ${pkg}, exited with error`);
          break;
        }
      }
    }

    const postInstallSize = this.postInstallCallbacks.size;
    let i = 0;
    for (const postInstallCb of this.postInstallCallbacks) {
      console.log(`[Post Install] ${++i}/${postInstallSize}`);
      await postInstallCb();
    }
  }

  public async promptAndInstallPackages(args: PackageInstallArgs) {
    const selectedPackages = await this.prompt();
    return this.installPackages(selectedPackages, args);
  }

}