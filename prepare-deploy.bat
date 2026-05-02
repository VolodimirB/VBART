@echo off
echo Preparing deployment folder...

set SRC=C:\work\vbart
set DEST=C:\work\vbart-deploy

:: Remove old deploy folder if exists
if exist "%DEST%" (
    echo Removing old deploy folder...
    rmdir /s /q "%DEST%"
)

:: Create fresh deploy folder
mkdir "%DEST%"

:: Copy HTML pages
copy "%SRC%\index.html"      "%DEST%\index.html"
copy "%SRC%\collection.html" "%DEST%\collection.html"
copy "%SRC%\about.html"      "%DEST%\about.html"
copy "%SRC%\contact.html"    "%DEST%\contact.html"
copy "%SRC%\netlify.toml"    "%DEST%\netlify.toml"
copy "%SRC%\thanks.html"    "%DEST%\thanks.html"

:: Copy folders
xcopy "%SRC%\css"    "%DEST%\css"    /e /i /q
xcopy "%SRC%\js"     "%DEST%\js"     /e /i /q
xcopy "%SRC%\data"   "%DEST%\data"   /e /i /q
xcopy "%SRC%\admin"  "%DEST%\admin"  /e /i /q
xcopy "%SRC%\Images" "%DEST%\Images" /e /i /q

echo.
echo Done! Deploy folder ready at: %DEST%
echo Drag that folder onto Netlify to deploy.
pause
