---
layout: layout.pug
excerpt: Guide for upgrading of DC/OS Mixed OS cluster on Azure
title: Upgrade DC/OS on Azure using the Universal Installer
navigationTitle: Azure
menuWeight: 25
model: /mesosphere/dcos/2.1/data.yml
render: mustache
---

# Upgrade DC/OS for Windows for Microsoft Azure

The latest example of **main.tf** is [here](https://github.com/dcos-terraform/examples/blob/feature/windows-support-beta/azure/windows-agent/main.tf). After you have prepared your environment for installation, you are ready to start the installation process.

<p class="message--warning"><strong>WARNING: </strong>To prevent cluster installation failure, do not use B-Series burstable virtual machines (VMs) for the Bootstrap node.</p>

- Start a command-line interface such as bash, sh or WSL/WSL2.
- Verify that the Azure CLI is installed using the command:
``` az --version```
- Log in using the command:
```az login```
You will be forwarded to the web page for authorization and you should receive confirmation of a successful login to Azure.
- Add the Terraform SSH key to your SSH agent by starting the agent if it isn’t already running, and then load your key:
```eval "$(ssh-agent -s)”```
```ssh-add ~/.ssh/<your-key-name>```
Terraform will need to send out SSH keys to connect securely to the nodes it creates.
- Change the working directory to the place where you saved the main.tf terraform file and execute the following Terraform commands:
```terraform init```
```terraform apply```

[Check the status of the upgrade](/mesosphere/dcos/2.1/tutorials/windows/upgrade/check-upgrade/).
