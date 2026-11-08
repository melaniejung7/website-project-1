@echo off
title PawPath - Upload to GitHub Helper
echo ====================================================================
echo             PAWPATH WEBSITE - GITHUB UPLOADER HELPER
echo ====================================================================
echo.
echo Opening GitHub in your default browser...
start https://github.com/melaniejung7/website-project-1/upload

echo.
echo Opening your website folder with all 6 files...
explorer.exe "%~dp0"

echo.
echo ====================================================================
echo  ALL SET! 
echo.
echo  1. In the folder that just opened, select all 6 files:
echo     - index.html
echo     - style.css
echo     - music.js
echo     - app.js
echo     - oliver.jpg
echo     - README.md
echo.
echo  2. Drag them into your browser window where GitHub is open.
echo.
echo  3. Click the green "Commit changes" button at the bottom.
echo ====================================================================
echo.
pause
