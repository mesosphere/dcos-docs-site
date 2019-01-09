---
layout: layout.pug
excerpt: Install DC/OS cluster on Packet bare metal using Terraform
title: Running DC/OS on Packet
navigationTitle: Packet
menuWeight: 50
oss: true
---

<p class="message--warning"><strong>DISCLAIMER: </strong>This is a <a href="https://github.com/dcos/terraform-dcos/tree/master/gcp">community driven project</a> and not officially supported by Mesosphere. This installation method is used for fast demos and proofs of concept. This page explains how to install DC/OS cluster on Packet bare metal using Terraform templates. Terraform is intended for reference only and are not recommended for production use. Upgrades are not supported with the following installation methods.</p>

<p class="message--note"><strong>NOTE: </strong>Contact the <a href="https://groups.google.com/a/dcos.io/forum/#!forum/users">mailing list</a> or <a href="http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201">Slack channel</a> for community support. </p>

You can create a DC/OS cluster on Packet bare metal using Terraform. The included Terraform templates are configured to run Mesosphere DC/OS on Packet. Depending on the DC/OS services that you install, or the amount of computing power your workload needs, you might have to modify the templates to suit your needs. You can modify the Terraform templates, but Mesosphere cannot assist in troubleshooting. If you require support, you can email help@packet.net, visit the Packet IRC channel (#packethost on freenode) or consider [DC/OS Enterprise](https://mesosphere.com/). 

## Hardware

- One, three or five Mesos master nodes in the admin zone

- Four Mesos private agent nodes

- One Mesos public agent node

- Packet “Type 0” Server instances

# Create a DC/OS cluster

## Prerequisites

- [Packet API Key](https://help.packet.net/quick-start/api-integrations)

- [Packet Project ID](https://help.packet.net/quick-start/api-integrations)

- [Terraform by Hashicorp](https://www.terraform.io/intro/getting-started/install.html)

## Installing DC/OS

<p class="message--important"><strong>IMPORTANT: </strong>With this method, the network is open by default. Because of this, <a href="/1.12/administering-clusters/securing-your-cluster/#network-security">network security</a> is a concern and should be addressed as soon as possible by the administrator.</p>

1.  Download and install Terraform using the instructions on the link provided in the Prerequisites section.

2.  [Download the DC/OS Terraform manifests from GitHub](https://github.com/dcos/packet-terraform) into a local  directory.

    ```bash
    git clone https://github.com/dcos/packet-terraform
    ```

3.  From that directory, generate an ssh keypair:

    ```bash
    ssh-keygen -t rsa -f ./packet-key
    ```

4.  Copy `sample.terraform.tfvars` to a new file named `terraform.tfvars`, and edit the new file, filling in the values as desired. The following are blank and if not filled in, you will be prompted by terraform when necessary:

    - `packet_api_key` - Your Packet API key

    - `packet_project_id` - Packet Project ID

    - `dcos_installer_url` - Where to get [DC/OS configuration file](https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh)

    The following have default values and may be changed depending on your requirements:

    - `packet_facility` - Packet facility: [ewr1|sjc1|ams1]
      ewr1 is New Jersey, ams1 is Amsterdam, sjc1 is San Jose - default sjc1

    - `packet_agent_type` - Type of Packet Server to use for the DC/OS Agents: [`baremetal_0`|baremetal_1|baremetal_3]
      Choose the Packet Server type to use for the DC/OS Private Agents - default `baremetal_0`

    - `packet_master_type` - Type of Packet Server to use for the DC/OS Master: [`baremetal_0`|baremetal_1|baremetal_3]
      Choose the Packet Server type to use for the DC/OS Master Nodes - default `baremetal_0`

    - `packet_boot_type` - Type of Packet Server to use for the DC/OS Boot Node: [`baremetal_0`|baremetal_1|baremetal_3]
      Choose the Packet Server type to use for the DC/OS Boot Server - default `baremetal_0`

    - `dcos_cluster_name` - the name of your DC/OS cluster - defaults to `packet-dcos`

    - `dcos_agent_count` - Number of private agents to deploy - defaults to four

    - `dcos_public_agent_count` - Number of public agents to deploy - defaults to one

    - `dcos_init_pubkey` - The path to your ssh public key created in step 4 - defaults to ./packet-key.pub

    - `key_file_path` - The path to your ssh private key created in step 4 - defaults to ./packet-key

5.  Also from that same directory, run `terraform apply` which will deploy the servers into your project at Packet, and run the DC/OS installation routine. When it completes, you will see output similar to the following, but with the IP addresses assigned to your servers:

    ![terraform apply output](/1.12/img/packet_terraform_output.png)

    Figure 1. "Terraform apply" output

You may need to wait a few minutes from this point for all the DC/OS services to become active and the control panel available on the master node. After 15 or 20 minutes, see the [troubleshooting](/1.12/installing/troubleshooting/) documentation.

# Launch DC/OS
Launch the DC/OS web interface by entering the Mesos master IP address:

1.  Cut and paste the link provided by running `terraform apply`, or by running terraform output from the same directory, into your browser to open the DC/OS web interface. The interface runs on the standard HTTP port 80, so you do not need to specify a port number after the hostname.

2.  Install the DC/OS Command-Line Interface (CLI). You can install the CLI to administer your DC/OS cluster. You can access the documentation at any time by clicking the cluster name in the upper-left side.

    ![install CLI](/1.12/img/install-cli-terminal.png)

    Figure 2. Install DC/OS CLI screen

## Next steps

- Adding and removing nodes:

  - Run `terraform apply -var ‘dcos_agent_count=N’` to change the private agent count to the number specified. (`‘dcos_public_agent_count’` is also available).

  - Increasing node count is fast and safe.

  - We recommend against reducing the node count in production. Stateful DC/OS apps and services may suffer outages and failures if nodes are not put into maintenance mode, and their tasks rescheduled through their respective schedulers.
