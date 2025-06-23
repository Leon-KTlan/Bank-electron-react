# 编译React应用
npm run build:react
regedit /s kiosk.reg
# 打包Electron应用
npm run build:electron

# 创建快捷方式
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$Home\Desktop\BankElectron.lnk")
$Shortcut.TargetPath = "$PWD\dist\BankElectron Setup.exe"
$Shortcut.Save()

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" -Name Shell -Value "$edgePath --kiosk http://localhost:3002 --no-first-run" -Force

# 重启生效
Restart-Computer -Force


# 设置开机启动
Copy-Item "$Home\Desktop\BankElectron.lnk" "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\"


# 在原部署脚本中添加以下注册表配置项

# 禁用任务管理器
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\System" -Name "DisableTaskMgr" -Value 1 -Type DWord

# 屏蔽系统热键
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" -Name "NoWinKeys" -Value 1 -Type DWord

# 设置Edge为唯一允许程序
$restrictPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer"
New-Item -Path $restrictPath -Name "RestrictRun" -Force
Set-ItemProperty -Path "$restrictPath\RestrictRun" -Name "1" -Value "msedge.exe" -Type String
Set-ItemProperty -Path "$restrictPath\RestrictRun" -Name "2" -Value "BankElectron.exe" -Type String

# 隐藏任务栏（需重启生效）
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\StuckRects3" -Name "Settings" -Value ([byte[]](0x08,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00)) -Type Binary