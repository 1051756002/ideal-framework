@echo off

set DIR=%~dp0
set H5_FRAMEWORK_PATH=%DIR%assets\framework
set HALL_PATH=%DIR%..\h5_hall\assets

echo %H5_FRAMEWORK_PATH%
echo %HALL_PATH%

rd /s/q %HALL_PATH%\framework
cd %HALL_PATH%

mklink framework %H5_FRAMEWORK_PATH% /D

@pause