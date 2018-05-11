@echo off

set DIR=%~dp0
set H5_FRAMEWORK_PATH=%DIR%assets
set HALL_PATH=%DIR%..\h5_hall\assets

echo %H5_FRAMEWORK_PATH%
echo %HALL_PATH%

rd /s/q %HALL_PATH%\framework
rd /s/q %HALL_PATH%\resources\framework
cd %HALL_PATH%

xcopy %H5_FRAMEWORK_PATH%\framework %HALL_PATH%\framework /s/e/i/y
xcopy %H5_FRAMEWORK_PATH%\resources\framework %HALL_PATH%\resources\framework /s/e/i/y
@pause
