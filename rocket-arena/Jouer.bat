@echo off
rem Lance Supersonic Arena dans une fenetre dediee (Edge ou Chrome), sinon dans le navigateur par defaut.
set "GAME=%~dp0index.html"
set "EDGE1=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
set "EDGE2=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
set "CHROME1=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
set "CHROME2=%LocalAppData%\Google\Chrome\Application\chrome.exe"
for %%B in ("%EDGE1%" "%EDGE2%" "%CHROME1%" "%CHROME2%") do (
  if exist %%B (
    start "" %%B --app="file:///%GAME%" --start-fullscreen
    exit /b
  )
)
start "" "%GAME%"
