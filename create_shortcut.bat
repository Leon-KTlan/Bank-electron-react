@echo off
setlocal enabledelayedexpansion

REM 设置目标 URL
set TARGET=http://localhost:3001

REM 生成桌面快捷方式
set SHORTCUT="%USERPROFILE%\Desktop\bank-kiosk.url"
(
  echo [InternetShortcut]
  echo URL=%TARGET%
  echo IconIndex=0
  echo IconFile=C:\windows\system32\SHELL32.dll
) > %SHORTCUT%

REM 可选：部署到开机启动目录
set STARTUP_DIR="%ProgramData%\Microsoft\Windows\Start Menu\Programs\Startup"
if not exist %STARTUP_DIR% ( md %STARTUP_DIR% )
copy /y %SHORTCUT% %STARTUP_DIR% >nul

REM 可选：添加公共桌面支持
if exist "%PUBLIC%\Desktop" (
    copy /y %SHORTCUT% "%PUBLIC%\Desktop\" >nul
)