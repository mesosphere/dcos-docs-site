---
layout: layout.pug
excerpt: Install DC/OS cluster on DigitalOcean using Terraform
title: Running DC/OS on DigitalOcean
navigationTitle: DigitalOcean
menuWeight: 40
oss: true
---

<p class="message--warning"><strong>DISCLAIMER: </strong>This is a <a href="https://github.com/dcos/terraform-dcos/tree/master/gcp">community driven project</a> and not officially supported by Mesosphere. This installation method is used for fast demos and proofs of concept. This page explains how to install DC/OS cluster on DigitalOcean using Terraform. Terraform is intended for reference only and are not recommended for production use. Upgrades are not supported with the following installation methods.</p>

<p class="message--note"><strong>NOTE: </strong>Contact the <a href="https://groups.google.com/a/dcos.io/forum/#!forum/users">mailing list</a> or <a href="http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201">Slack channel</a>for community support.</p>

You can create a DC/OS cluster on DigitalOcean using Terraform.

The included Terraform templates are configured to run Mesosphere DC/OS on DigitalOcean. Depending on the DC/OS services that you install, or the amount of computing power your workload needs, you might have to modify the templates to suit your needs. You can modify the Terraform templates, but Mesosphere cannot assist in troubleshooting. If you require support with droplet creation or other related issues, email <a href="mailto:support@digitalocean.com"></a>, visit the unofficial DigitalOcean IRC channel (#digitalocean on freenode) or consider [DC/OS Enterprise](https://mesosphere.com/).

## Security

<p class="message--important"><strong>IMPORTANT: </strong>With this method, the network is open by default. Because of this, <a href="/1.12/administering-clusters/securing-your-cluster/#network-security">network security</a> is a concern and should be addressed as soon as possible by the administrator.</p>

## Environment

- One, three or five Mesos master nodes in the admin zone

- Four Mesos private agent nodes

- One Mesos public agent node

- DigitalOcean 4GB (or more) Droplets

# Create a DC/OS cluster

## Prerequisites

- [DigitalOcean API Key](https://www.digitalocean.com/help/api/)

- [Terraform by Hashicorp](https://www.terraform.io/intro/getting-started/install.html)

## Installing DC/OS

1.  Download and install Terraform using the instructions on the links provided above.

2.  [Download the DC/OS Terraform manifests from GitHub](https://github.com/jmarhee/digitalocean-dcos-terraform) into a local  directory.

    ```bash
    git clone https://github.com/jmarhee/digitalocean-dcos-terraform
    ```

3.  From that directory, generate an `ssh` keypair.

    ```bash
    ssh-keygen -t rsa -f ./do-key
    ```

4.  Get a token to use against the API. You can [follow the documentation](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-api-v2).

5.  Add the key to DigitalOcean.

    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"dcos-key","public_key":"<public-key>"}' "https://api.digitalocean.com/v2/account/keys"
    ```

6. Get the key ID.

    ```bash
    curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer $TOKEN' "https://api.digitalocean.com/v2/account/keys"
    ```

7.  Copy `sample.terraform.tfvars` to a new file named `terraform.tfvars`, and edit the new file, filling in the values as desired. The following fields are blank; if not filled in, you will be prompted by Terraform when necessary:

    - `digitalocean_token` - Your DigitalOcean API key

    - `ssh_key_fingerprint` - The key ID from above

    - `dcos_installer_url` - Where to get DC/OS
      https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh

The following have default values and may be changed depending on your requirements:

   - `region` - DigitalOcean facility: [NYC1|NYC2|NYC3|SGP1|LON1|AMS2|AMS3|SFO1|TOR1|FRA1]
    Choose the DigitalOcean datacenter for your cluster - default NYC2

   - `agent_size` - Size of DigitalOcean Droplet to use for the DC/OS Agents: [4GB|8GB|16GB|32GB|48GB|64GB]
    Choose the DigitalOcean droplet size to use for the DC/OS Private Agents - default 4GB

   - `master_size` - Size of DigitalOcean Droplet to use for the DC/OS Master: [4GB|8GB|16GB|32GB|48GB|64GB]
    Choose the DigitalOcean droplet size to use for the DC/OS Master Nodes - default 4GB

   - `boot_size` - Size of DigitalOcean Droplet to use for the DC/OS Boot Node: [4GB|8GB|16GB|32GB|48GB|64GB]
    Choose the DigitalOcean droplet size to use for the DC/OS Boot Server - default 4GB

   - `dcos_cluster_name` - the name of your DC/OS cluster - defaults to digitalocean-dcos

   - `dcos_agent_count` - Number of private agents to deploy - defaults to  4

   - `dcos_public_agent_count` - Number of public agents to deploy - defaults to 1

   - `dcos_init_pubkey` - The path to your ssh public key created in step 4 - defaults to ./do-key.pub

   - `key_file_path` - The path to your ssh private key created in step 4 - defaults to ./do-key

8.  Also from that same directory, run `terraform init` and then `terraform apply` which will deploy the servers into your project at DigitalOcean, and run the DC/OS installation routine. When it completes, you will see output similar to the following, but with the IP addresses assigned to your servers:

  ![terraform apply output](/1.13/img/digitalocean_terraform_output.png)

  Figure 1. Terraform apply output

You may need to wait a few minutes from this point for all the DC/OS services to become active and the control panel to become available on the master node. After 15 or 20 minutes, check out the [troubleshooting](/1.13/installing/troubleshooting/) documentation.

# Launch DC/OS
Launch the DC/OS web interface by entering the Mesos master IP address:

1.  Cut and paste the link provided by running `terraform apply`, or by running `terraform output` from the same directory, into your browser to open the DC/OS web interface. The interface runs on the standard HTTP port 80, so you do not need to specify a port number after the hostname.

2.  Install the DC/OS Command-Line Interface (CLI). You can install the CLI to administer your DC/OS cluster. You can access the documentation at any time by clicking the cluster name in the upper-left side.

  ![install CLI](/1.13/img/install-cli-terminal.png)

  Figure 2. Installing the CLI

## Next steps

- Adding and removing nodes:

  - Run `terraform apply -var ‘dcos_agent_count=N’` to change the private agent count to the number specified. (`‘dcos_public_agent_count’` is also available)

  - Increasing node count is fast, safe, and fun!

  - We recommend against reducing the node count in production. Stateful DC/OS apps and services may suffer outages and failures if nodes are not put into maintenance mode, and their tasks rescheduled through their respective schedulers.
