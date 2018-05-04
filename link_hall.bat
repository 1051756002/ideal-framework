@echo off

set DIR=%~dp0
set H5_FRAMEWORK_PATH=%DIR%..\h5_hall\assets\hall
set PROJECT_PATH=%DIR%..\h5_game\assets

echo %H5_FRAMEWORK_PATH%
echo %PROJECT_PATH%

rd /s/q %PROJECT_PATH%\hall
rd /s/q %PROJECT_PATH%\res\hall
rd /s/q %PROJECT_PATH%\resources\hall

cd %PROJECT_PATH%
mklink hall %H5_FRAMEWORK_PATH% /D

cd %PROJECT_PATH%\res
mklink hall %H5_FRAMEWORK_PATH%\res\hall /D

cd %PROJECT_PATH%\resources
mklink hall %H5_FRAMEWORK_PATH%\resources\hall /D

@pause