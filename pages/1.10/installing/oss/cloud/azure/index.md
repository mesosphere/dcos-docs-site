---
layout: layout.pug
excerpt:
title: Running DC/OS on Azure
navigationTitle: Azure
menuWeight: 1
---

This page explains how to install DC/OS 1.10 using the Azure Resource Manager templates.

**Tip:** To get support on Azure Marketplace-related questions, join the Azure Marketplace [Slack community](http://join.marketplace.azure.com).

**Important:** Upgrades are not supported with this installation method.

# System requirements

## Hardware

To use all of the services offered in DC/OS, you should choose at least five Mesos Agents using `Standard_D2` [Virtual Machines](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/), which is the default size in the DC/OS Azure Marketplace offering.

Selecting smaller-sized VMs is not recommended, and selecting fewer VMs will likely cause certain resource-intensive services such as distributed datastores not to work properly (from installation issues to operational limitations).

## Software

You will need an active [Azure subscription](https://azure.microsoft.com/en-us/pricing/purchase-options/) to install DC/OS via the Azure Marketplace.

Also, to access nodes in the DC/OS cluster you will need `ssh` installed and configured.

# Install DC/OS

## Step 1: Deploying the template

To install DC/OS 1.10 on Azure, use the [Azure Resource Manager templates](https://downloads.dcos.io/dcos/stable/azure.html) provided.

Some notes of the template configuration is below,

- Choose `East US` as the Location, because some resources of the template may not available in other location.
- Set `Oauth Enabled` to true if you want to sign in the DC/OS Dashboard through OAuth.
- Fill up the `Agent Endpoint DNS Name Prefix` and `Master Endpoint DNS Name Prefix`.
- Enter your `Ssh RSA Public Key`.

## Step 2: Accessing DC/OS

First, look up `MASTERFQDN` in the outputs of the deployment. To find that, click on the link under `Last deployment` (which is `4/15/2016 (Succeeded)` here) and you should see this:

![Deployment history](/1.10/img/dcos-azure-marketplace-step2a.png)

Click on the latest deployment and copy the value of `MASTERFQDN` in the `Outputs` section:

![Deployment output](/1.10/img/dcos-azure-marketplace-step2b.png)

Use the value of `MASTERFQDN` you found in the `Outputs` section in the previous step, and we will use it in the following step.

Because of security considerations, you can not visit the DC/OS Dashboard in Azure directly by default. Here, we provide two ways to work around. Please find your case below,

### Case 1:

In order to visit the the DC/OS Dashboard, we will need to access the TCP port 80 or 443 of the master node. You can add an inbound security rule and an inbound NAT rule.

Find the network security group resource of the master node,

![Resource - Master Node Network Security Group](/1.10/img/dcos-azure-step2case1a.png)

Click on the "Inbound security rules" tab on the left side,

![Inbound Security Rules](/1.10/img/dcos-azure-step2case1b.png)

Add an inbound security rule.

![Add Inbound Security Rules](/1.10/img/dcos-azure-step2case1c.png)

Find the load balancer resource of the master node,

![Resource - Master Node Load balancer](/1.10/img/dcos-azure-step2case1d.png)

Click on the "Inbound NAT rules" tab on the left side,

![Inbound NAT Rules](/1.10/img/dcos-azure-step2case1e.png)

Add an inbound NAT rule.

![Add Inbound NAT Rules](/1.10/img/dcos-azure-step2case1f.png)

Now you can visit `http://$MASTERFQDN` and view the DC/OS Dashboard.

### Case 2: Using ssh tunnel

In this case, we need to setup a ssh tunnel, to forward TCP port 80 of the master node on the azure to the 8000 port of your local machine.

Use the value of `MASTERFQDN` you found in the previous step and paste it in the following command:

```bash
ssh azureuser@$MASTERFQDN -L 8000:localhost:80
```

For example, in my case:

```bash
ssh azureuser@dcosmaster.westus.cloudapp.azure.com -L 8000:localhost:80
```

Now you can visit `http://localhost:8000` on your local machine and view the DC/OS Dashboard.

![DC/OS dashboard](/1.10/img/dcos-gui.png)

#### Caveats

Some caveats around SSH access:

- For connections to `http://localhost:8000` to work, the SSH command must be run on your local machine, and not inside a Virtual Machine.
- In the example above, port `8000` is assumed to be available on your local machine.
- The SSH commands shown only work on Mac or Linux. For Windows use [Putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) with a similar port-forwarding configuration, see also [How to Use SSH with Windows on Azure](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-ssh-from-windows/).
- If you want to learn more about SSH key generation check out this [GitHub tutorial](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).

The DC/OS UI will not show the correct IP address or CLI install commands when connected by using an SSH tunnel.

## Run DC/OS CLI

The following commands can be used to run the DC/OS CLI directly on the master node:

```bash
# Connect to master node with ssh
ssh azureuser@$MASTERFQDN

# Install CLI on the master node and configure with http://localhost
curl https://downloads.dcos.io/binaries/cli/linux/x86-64/dcos-1.10/dcos -o dcos &&
sudo mv dcos /usr/local/bin &&
sudo chmod +x /usr/local/bin/dcos &&
dcos cluster setup http://localhost &&
dcos

# Now you can use the DC/OS CLI:
dcos package search
```

## Tear down the DC/OS cluster

If you've created a new resource group in the deployment step, it is as easy as this to tear down the cluster and release all of the resources: just delete the resource group. If you have deployed the cluster into an existing resource group, you'll need to identify all resources that belong to the DC/OS cluster and manually delete them.

## Next steps

- [Add users to your cluster][1]
- [Install the DC/OS Command-Line Interface (CLI)][2]
- [Scaling considerations][4]

[1]: /1.10/security/ent/users-groups/
[2]: /1.10/cli/install/
[4]: https://azure.microsoft.com/en-us/documentation/articles/best-practices-auto-scaling/
