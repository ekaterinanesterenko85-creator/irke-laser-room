@echo off
chcp 65001 >nul
cd /d "%~dp0"

start "" "%~dp0site.html"

where node >nul 2>&1
if %ERRORLEVEL%==0 (
  echo Node найден. Для React-версии сайта:
  echo   npm install
  echo   npm run dev
) else (
  echo Открыт preview\site.html — полный предпросмотр лендинга.
  echo Для React-версии установите Node.js: https://nodejs.org/
)

pause
