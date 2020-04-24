---
layout: layout.pug
title: Upgrading of On-Prem Installation 
navigationTitle: On-Prem 
menuWeight: 35
model: /mesosphere/dcos/2.1/data.yml
excerpt: Guide for upgrading of DC/OS Mixed OS cluster On-Prem
---

# Upgrade DC/OS for Windows On-Premises

Before beginning your DC/OS for Windows upgrade, familiarize yourself with the workflow in the [Upgrading a DC/OS cluster](/mesosphere/dcos/2.0/installing/production/upgrading/).

## Download the Microsoft Windows Installer

- Log in to the Linux bootstrap node and make the working directory the same location where the Linux installer is stored on the Bootstrap agent. For example ```/opt/dcos-install/<new_version>```.
- Download the package from the official D2IQ(R) repository using the URL. URLs for Beta 2 are listed below:
#### DC/OS 2.1.0-beta2 Enterprise
- https://downloads.mesosphere.io/dcos-enterprise/testing/2.1.0-beta2/commit/3f6cabacb2a3c35a5b39be5537a0f2aa222f3640/dcos_generate_config.ee.sh
#### DC/OS 2.1.0-beta2 Enterprise Windows
- https://downloads.mesosphere.com/dcos-enterprise/testing/2.1.0-beta2/commit/3f6cabacb2a3c35a5b39be5537a0f2aa222f3640/windows/dcos_generate_config_win.ee.sh

#### DC/OS 2.1.0-beta2 Open
- https://downloads.dcos.io/dcos/testing/2.1.0-beta2/commit/651b16e6221cf06a5306f3e9affa4dd0061050c3/dcos_generate_config.sh
#### DC/OS 2.1.0-beta2 Open Windows
- https://downloads.dcos.io/dcos/testing/2.1.0-beta2/windows/dcos_generate_config_win.sh

- Run the extraction from the same location as the Linux installer with the command (example for DCOS open):
```cd /opt/dcos-install/2.1.0-Beta2```
```curl https://downloads.dcos.io/dcos/testing/2.1.0-beta2/windows/dcos_generate_config_win.sh -o dcos_generate_config_win.sh```
```chmod +x dcos_generate_config_win.sh```
```sh ./dcos_generate_config_win.sh```

## Windows Node upgrade

- Start a PowerShell console, if one is not already running.
```PowerShell.exe```
- Create the upgrade folders.
```mkdir C:\d2iq\dcos\2.1.0-beta2```
- Download dcos_node_upgrade.ps1 script from Bootstrap node to c:\d2iq\dcos\2.1.0-beta2 folder:
```Invoke-WebRequest http://<bootstrap_node_ip_address>:8080/<dcos_ver>/genconf/serve/windows/upgrade_from_<ver>/latest/dcos_node_upgrade.ps1 -UseBasicParsing -OutFile c:\d2iq\dcos\2.1.0-beta2\dcos_node_upgrade.ps1```
- Run dcos_node_upgrade.ps1

In case of success, you will get similar output

![cmd output](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/winpanda-upgr-output.png)

## Troubleshooting

You can troubleshoot issues using the log files: ```dcos_node_upgrade.log``` and ```winpanda.log```. Default location is under: ```C:\d2iq\dcos\var\log\<pkgname>```.
