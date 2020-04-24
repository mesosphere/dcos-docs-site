---
layout: layout.pug
excerpt: Guide for installation of DC/OS Mixed OS cluster on Azure
title: DC/OS on Azure using the Universal Installer
navigationTitle: Azure
menuWeight: 2
model: /mesosphere/dcos/2.1/data.yml
render: mustache
---

# Install DC/OS for Windows for Microsoft Azure

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

The output will be similar to this example:

masters_dns_name = lb-demo-ee-ip.westus.cloudapp.azure.com
winagent-ips = [
    winagt-1-demo-ee.westus.cloudapp.azure.com
]
windows_passwords = [
    OJ@l-rNW-8UxGsonTB9y0NVmsjsjHlCO
]

- The format for a Windows node host name is:
**“winagt-%[1]d-%[2]s"**
where:
[1] is the count index. The first Windows node in the cluster has count.index = 1, second - (count.index + 1), and so on.
[2] is the cluster name.

The Azure region name is predefined by the location of an AzureRG, for example, "westus", or "northeurope".

Azure assigns the VMs to a subdomain of cloudapp.azure.com, therefore, it is a standard dns suffix for any virtual machines hosted in Azure cloud.

Default username for windows node is **dcosadmin** unless you did not specify any other in the **main.tf** file.

For the cluster mentioned above, the Host name of the first Windows node is:
**winagt-1-demo-ee**

