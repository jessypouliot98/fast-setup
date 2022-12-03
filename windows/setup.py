import os
import subprocess
from pathlib import Path
import webbrowser

downloads_path = str(Path.home() / "Downloads")

# Utils

def ask(question):
  answer = input(question +  ' [y/n] (y): ')
  return answer.lower() != 'n'

def askToInstall(category):
  shouldInstall = ask('Do you want to install ' + category + ' ?')
  if shouldInstall:
    print('Installing ' + category + '...')
  else:
    print('Skipped ' + category)
  return shouldInstall;

def getDownloadDest(fileName):
  return downloads_path + '/' + fileName;

def downloadAndRun(url, fileName):
  try:
    subprocess.call(['powershell', 'Invoke-WebRequest', '-Uri', url, '-OutFile', getDownloadDest(fileName)])
    return True
  except:
    return False

def openInBrowser(url):
  try:
    webbrowser.open(url, new=2)
    return True
  except:
    return False

def wingetInstall(appId, force = False):
  print('Installing ' + appId);
  try:
    forceFlag = '--force' if force else ''
    code = subprocess.call(['powershell', 'winget', 'install', appId, forceFlag])
    if (code > 0):
      raise Exception('winget error')
    return True
  except:
    shouldRetry = ask('Retry with force ?')
    if (shouldRetry):
      return wingetInstall(appId, True)
    return False

def appxUninstall(packageName):
  print('Uninstalling ' + packageName)
  command = ', '.join(['DISM', '/Online', '/Remove-ProvisionedAppxPackage', '/PackageName:' + packageName])
  os.system('powershell start-process PowerShell -verb runas -Wait -ArgumentList "' + command + '"')

# Installers

def installWSL():
  try:
    subprocess.call(['powershell', 'wsl', '--install', '-d', 'Ubuntu'])
    return 1
  except:
    return 0

def installGPUApps():
  gpuType = input('Enter your GPU type [nvidia|amd]: ')
  if (gpuType == 'nvidia'):
    wingetInstall('Nvidia.GeForceExperience')
    wingetInstall('Nvidia.Broadcast')
  elif (gpuType == 'amd'):
    openInBrowser('https://www.amd.com/en/support')
  else:
    print('No GPU selected')

def installCPUApps():
  cpuType = input('Enter your CPU type [intel|amd]: ')
  if (cpuType == 'intel'):
    openInBrowser('https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&layout=table&f:@tabfilter=[Downloads]')
  elif (cpuType == 'amd'):
    openInBrowser('https://www.amd.com/en/support')
  else:
    print('No CPU selected')


# Main

def main():
  # Base
  if askToInstall('Required apps'):
    wingetInstall('7zip.7zip')
    wingetInstall('Google.Chrome')

  # Drivers
  if askToInstall('Drivers'):
    installCPUApps()
    installGPUApps()

  # Misc
  if askToInstall('Common apps'):
    wingetInstall('Discord.Discord')
    wingetInstall('Spotify.Spotify')
    wingetInstall('Iriun.IriunWebcam')

  # Games
  if askToInstall('Game apps & games'):
    wingetInstall('Valve.Steam')
    wingetInstall('EpicGames.EpicGamesLauncher')
    wingetInstall('Ubisoft.Connect')
    wingetInstall('PlayStation.PSRemotePlay')
    wingetInstall('RiotGames.LeagueOfLegends.NA')
    wingetInstall('Parsec.Parsec')

  # Code
  if askToInstall('Code tools'):
    wingetInstall('Git.Git')
    wingetInstall('Fork.Fork')
    wingetInstall('Microsoft.VisualStudioCode')
    wingetInstall('Microsoft.WindowsTerminal')
    wingetInstall('TablePlus.TablePlus')
    wingetInstall('Postman.Postman')
    wingetInstall('Docker.DockerDesktop')

  # Dev
  if askToInstall('Dev dependencies'):
    wingetInstall('OpenJS.NodeJS')
    installWSL()


if __name__ == "__main__":
  main()