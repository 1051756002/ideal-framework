@echo off

set DIR=%~dp0
set H5_FRAMEWORK_PATH=%DIR%assets\framework
set HALL_PATH=%DIR%..\h5_fuxin\assets

echo %H5_FRAMEWORK_PATH%
echo %HALL_PATH%

rd /s/q %HALL_PATH%\framework
cd %HALL_PATH%

xcopy %H5_FRAMEWORK_PATH% %HALL_PATH%\framework /s/e/i/y
@pause