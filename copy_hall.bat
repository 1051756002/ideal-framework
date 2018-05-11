@echo off

set DIR=%~dp0
set H5_FRAMEWORK_PATH=%DIR%..\h5_hall\assets
set PROJECT_PATH=%DIR%..\h5_game\assets

echo %H5_FRAMEWORK_PATH%
echo %PROJECT_PATH%

rd /s/q %PROJECT_PATH%\hall
rd /s/q %PROJECT_PATH%\res\hall
rd /s/q %PROJECT_PATH%\resources\hall
rd /s/q %PROJECT_PATH%\common

cd %PROJECT_PATH%
xcopy %H5_FRAMEWORK_PATH%\hall hall /s/e/i/y
xcopy %H5_FRAMEWORK_PATH%\common common /s/e/i/y

cd %PROJECT_PATH%\res
xcopy %H5_FRAMEWORK_PATH%\res\hall hall /s/e/i/y

cd %PROJECT_PATH%\resources
xcopy %H5_FRAMEWORK_PATH%\resources\hall hall /s/e/i/y

@pause