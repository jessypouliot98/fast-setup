import subprocess
from pathlib import Path
import webbrowser

# Utils

downloads_path = str(Path.home() / "Downloads")

def askToInstall(category):
  answer = input('Do you want to install ' + category + ' ? [y/n] (y): ')
  shouldInstall = answer.lower() != 'n'
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
    return 1
  except:
    return 0

def openInBrowser(url):
  try:
    webbrowser.open(url, new=2)
    return 1
  except:
    return 0

def wingetInstall(appId):
  try:
    subprocess.call(['powershell', 'winget', 'install', appId])
    return 1
  except:
    return 0


# Installers

def installChrome():
  return wingetInstall('Google.Chrome')

def installSteam():
  return wingetInstall('Valve.Steam')
  
def installDiscord():
  return wingetInstall('Discord.Discord')

def installEpicGames():
  return wingetInstall('EpicGames.EpicGamesLauncher')

def installUbisoftConnect():
  return wingetInstall('Ubisoft.Connect')

def installFork():
  return wingetInstall('Fork.Fork')

def installVSCode():
  return wingetInstall('Microsoft.VisualStudioCode')

def installLeagueOfLegends():
  return wingetInstall('RiotGames.LeagueOfLegends.NA')

def installIriunWebcam():
  return wingetInstall('Iriun.IriunWebcam')

def installPlaystationRemotePlay():
  return wingetInstall('PlayStation.PSRemotePlay')

def installSpotify():
  return wingetInstall('Spotify.Spotify')

def installTerminal():
  return wingetInstall('Microsoft.WindowsTerminal')

def installGit():
  return wingetInstall('Git.Git')

def installNvidiaGeForceExperience():
  return wingetInstall('Nvidia.GeForceExperience')

def installNvidiaBroadcast():
  return wingetInstall('Nvidia.Broadcast')

def downloadAMDRadeonSoftware():
  return openInBrowser('https://www.amd.com/en/support')

def downloadAMDRyzenSoftware():
  return openInBrowser('https://www.amd.com/en/support')

def downloadIntelDrivers():
  return openInBrowser('https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&layout=table&f:@tabfilter=[Downloads]')

def install7Zip():
  return wingetInstall('7zip.7zip')

def installWSL():
  try:
    subprocess.call(['powershell', 'wsl', '--install', '-d', 'Ubuntu'])
    return 1
  except:
    return 0

def installGPUApps():
  gpuType = input('Enter your GPU type [nvidia|amd]: ')
  if (gpuType == 'nvidia'):
    installNvidiaGeForceExperience()
    installNvidiaBroadcast()
  elif (gpuType == 'amd'):
    downloadAMDRadeonSoftware()
  else:
    print('No GPU selected')

def installCPUApps():
  cpuType = input('Enter your CPU type [intel|amd]: ')
  if (cpuType == 'intel'):
    downloadIntelDrivers()
  elif (cpuType == 'amd'):
    downloadAMDRyzenSoftware()
  else:
    print('No CPU selected')


# Main

def main():
  # Base
  if askToInstall('Required apps'):
    install7Zip()
    installChrome()

  # Drivers
  if askToInstall('Drivers'):
    installCPUApps()
    installGPUApps()

  # Misc
  if askToInstall('Common apps'):
    installDiscord()
    installSpotify()
    installIriunWebcam()

  # Games
  if askToInstall('Game apps & games'):
    installSteam()
    installEpicGames()
    installUbisoftConnect()
    installPlaystationRemotePlay()
    installLeagueOfLegends()

  # Code
  if askToInstall('Code tools'):
    installGit()
    installFork()
    installVSCode()
    installTerminal()

  # Dev
  if askToInstall('Dev dependencies'):
    installWSL()


if __name__ == "__main__":
  main()