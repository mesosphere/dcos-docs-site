---
layout: layout.pug
title: On-Prem Installation 
navigationTitle: On-Prem Installation 
menuWeight: 15
model: /mesosphere/dcos/2.1/data.yml
excerpt: Guide for installation of DC/OS Mixed OS cluster On-Prem
---

# Install DC/OS for Windows On-Premises

Before beginning your DC/OS for Windows installation, familiarize yourself with the workflow in the [DC/OS Cluster On-Prem Guide](/mesosphere/dcos/2.0/installing/production/).

## Prerequisites

You must have:
- Microsoft (R) Windows(R) Server 1809 Core with Containers, or later.
- [Configured WINRM for HTTPS](https://support.microsoft.com/en-us/help/2019527/how-to-configure-winrm-for-https).

If you are unable to use this operating system, you must [install the Docker(R) engine](https://docs.docker.com/ee/docker-ee/windows/docker-ee/) on your Windows node.

## Download the Microsoft Windows Installer

Like Linux, the Windows software has its own installer, a single tarball named, ```dcos_generate_config_win.ee.sh```.
- Log in to the Linux bootstrap node and make the working directory the same location where the Linux installer is stored on the Bootstrap agent. The default location is ```/opt/dcos-install/<version>```.
- Download the package from the official D2IQ(R) repository using the URL:

https://downloads.mesosphere.iocom/dcos-enterprise/testing/2.1.0-beta1/dcos_generate_config.ee.sh

During Beta, the download package is prepared once per day.
- Run the extraction from the same location as the Linux installer with the command:
```cd /opt/dcos-install/2.1.0```
```curl https://downloads.mesosphere.iocom/dcos-enterprise/testing/2.1.0-beta1/windows/dcos_generate_config_win.ee.sh -o dcos_generate_config_win.ee.sh```
```chmod +x dcos_generate_config_win.ee.sh```
```sh ./dcos_generate_config_win.sh```

## Turn Off the Windows Firewall on all Windows agent nodes

To install and start your cluster, specific ports need to be available for use by DC/OS during initial installation. The easiest method to ensure port availability is to turn off the Windows firewall, but that option may not be available to you. If it is not, configure the Windows firewall to prevent port contention using the information in [DC/OS Ports](/mesosphere/dcos/2.0/installing/production/system-requirements/ports/). Ensure the required ports are available prior to starting the DC/OS installation.

We recommend that you use Microsoft PowerShell as the default shell for this configuration step.
- Start a PowerShell console.
```PowerShell.exe```
- Turn off the WIndows firewall.
```Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False```
- Disable the WIndows Defender Security Center temporarily.
```Set-MpPreference -DisableRealtimeMonitoring $true```
- Configure the Windows firewall for use with DC/OS similar to this example:
```New-NetFirewallRule -DisplayName "Admin Router Agent (HTTP)" -Direction Outbound -LocalPort 61001 -Protocol TCP -Action Allow```
```New-NetFirewallRule -DisplayName "Admin Router Agent (HTTPS)" -Direction Inbound -LocalPort 61002 -Protocol TCP -Action Allow```

## Windows Node Installation

- Start a PowerShell console, if one is not already running.
```PowerShell.exe```
- Create the base folders.
```mkdir C:\d2iq```
```mkdir C:\d2iq\dcos```
- Download dcos_install.ps1 script from Bootstrap node to C:\d2iq\dcos folder:
```Invoke-WebRequest http://<bootstrap_node_ip_address>:8080/<dcos_ver>/genconf/serve/windows/prerequisites/dcos_install.ps1 -UseBasicParsing -OutFile c:\d2iq\dcos\dcos_istall.ps1```
- Run dcos_install.ps1, and supply values for the following values when prompted:
```bootstrap_url: http://<bootstrap_node_ip_address>:8080/2.1.0/genconf/serve```
```masters: <master_node_ip_address>```

You can troubleshoot issues using the log files, dcos_install.log and winpanda.log, located by default under: C:\d2iq\dcos\var\log\<pkgname>.

