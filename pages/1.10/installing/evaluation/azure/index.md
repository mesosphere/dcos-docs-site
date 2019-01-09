---
layout: layout.pug
excerpt: Guide for DC/OS on Azure using the Mesosphere Universal Installer
title: DC/OS on Azure using the Universal Installer
navigationTitle: Azure
menuWeight: 2
---

To use the Mesosphere Universal Installer with Azure, the Azure command line interface must be installed and configured to the security credentials of the account you will be using for resources. The following instructions will guide you through the necessary account creation and credentials to be able to successfully configure your Azure CLI and install DC/OS.

## Prerequisites

- Linux, macOS, or Windows
- command-line shell terminal such as Bash or PowerShell
- verified Azure Resource Manager account with the necessary permissions

# Install Terraform

1. Visit the the [Terraform download page](https://www.terraform.io/downloads.html) for bundled installations and support for Linux, macOS and Windows. If you're on a Mac environment with [homebrew](https://brew.sh/) installed, simply run the following command:

    ```bash
    brew install terraform
    ```

# Install and configure the Azure CLI

1. Set up an [Azure Resource Manager account](https://azure.microsoft.com/en-us/free/) if you don't already have on. Make sure to have at least one [user role set up](https://docs.microsoft.com/en-us/azure/security-center/security-center-permissions). 

1. [Install the Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) guide to get `az` installed and running. For macOS users, it is available using Homebrew:

    ```bash
    brew install azure-cli
    ```

1. Once you have the Azure CLI, it needs to be connected to the account you would like to use. If you already had the CLI installed, you may already have your credentials set up. To set up your credentials, or to update them anytime as needed, run:

    ```bash
    az login
    ```

  Follow any directions, including signing in from your browser, to enable your CLI.

1. You can insure that you are logged in by listing your account permissions:

    ```bash
    az account
    ```

    Which will return something like:
    ```bash
    $ az account
    [
      {
        "cloudName": "AzureCloud",
        "id": "12345678-abcd-efgh-9876-abc123456789",
        "isDefault": true,
        "name": "DC/OS Production Subscription",
        "state": "Enabled",
        "tenantId": "987654321-abcd-efgh-9876-abc123456789",
        "user": {
          "name": "myaccount@azuremesosphere.onmicrosoft.com",
          "type": "user"
        }
      }
    ]
    ```

1. Set the `ARM_SUBSCRIPTION_ID`. The current Terraform Provider for Azure requires that the default Azure subscription be set before terraform can start. provide the Azure subscription ID. You can set the default account with the following command:

    ```bash
    export ARM_SUBSCRIPTION_ID="desired-subscriptionid"
    ```

    As an example:

    ```bash
    export ARM_SUBSCRIPTION_ID="12345678-abcd-efgh-9876-abc123456789"
    ```

    Ensure it is set:

    ```bash
    echo $ARM_SUBSCRIPTION_ID
    ```

# Set up SSH credentials for your cluster

1. Terraform uses SSH key-pairs to connect securely to the clusters it creates. If you already have a key-pair available and added to your SSH-Agent, you can skip this step.

    This starts an interactive process to create your key-pair. It will ask you to enter a location to store your keys. For example, to set up a new keypair in your `.ssh` directory:

    ```bash
    ssh-keygen -t rsa
    ```

    The full process will look something like this:

    ```bash
    Generating public/private rsa key pair.
    Enter file in which to save the key (/Users/<your-username>/.ssh/id_rsa): ~/.ssh/arm-demo-key
    Enter passphrase (empty for no passphrase): 
    Enter same passphrase again: 
    Your identification has been saved in /Users/<your-username>/.ssh/arm-demo-key.
    Your public key has been saved in /Users/<your-username>/.ssh/arm-demo-key.
    The key fingerprint is:
    4a:dd:0a:c6:35:4e:3f:ed:27:38:8c:74:44:4d:93:67 your-email@here
    The key's randomart image is:
    +--[ RSA 2048]----+
    |          .oo.   |
    |         .  o.E  |
    |        + .  o   |
    |     . = = .     |
    |      = S = .    |
    |     o + = +     |
    |      . o + o .  |
    |           . o   |
    |                 |
    +-----------------+
    ```

1. Add the key to your SSH agent. For example on macOS:

    ```bash
    ssh-add ~/.ssh/arm-demo-key
    ```

# Creating a DC/OS Cluster

1. Let’s start by creating a local folder and cd'ing into it. This folder will be used as the staging ground for downloading all required Terraform modules and holding the configuration for the cluster you are about to create.

    ```bash
    mkdir dcos-tf-azure-demo && cd dcos-tf-azure-demo
    ```

1. Create a file in that folder called `main.tf`, which is the configuration file the Mesosphere Universal Installer will call on each time when creating a plan. The name of this file should always be `main.tf`.

    ```bash
    touch main.tf
    ```

1. Open the file in the code editor of your choice and paste in the following. Notice the copy icon in the upper right hand corner of the code block to copy the code to your clipboard:

    ```hcl
    variable "dcos_install_mode" {
      description = "specifies which type of command to execute. Options: install or upgrade"
      default = "install"
    }

    data "http" "whatismyip" {
      url = "http://whatismyip.akamai.com/"
    }

    module "dcos" {
      source  = "dcos-terraform/dcos/azurerm"
      version = "~> 0.1"

      dcos_instance_os    = "coreos_1855.5.0"
      cluster_name        = "my-dcos"
      ssh_public_key_file = "<path-to-public-key-file>"
      admin_ips           = ["${data.http.whatismyip.body}/32"]
      location            = "West US"

      num_masters        = "1"
      num_private_agents = "2"
      num_public_agents  = "1"

      dcos_version = "1.10.8"

      # dcos_variant              = "ee"
      # dcos_license_key_contents = "${file("./license.txt")}"
      dcos_variant = "open"

      dcos_install_mode = "${var.dcos_install_mode}"
    }

    output "masters-ips" {
      value       = "${module.dcos.masters-ips}"
    }

    output "cluster-address" {
      value       = "${module.dcos.masters-loadbalancer}"
    }

    output "public-agents-loadbalancer" {
      value = "${module.dcos.public-agents-loadbalancer}"
    }
    ```

1. There are two main variables that must be set to complete the `main.tf`, and you can change any others here at this point too.

    1. `ssh_public_key_file = "<path-to-public-key-file>"`: the path to the public key for your cluster, following our example it would be:
        ```bash
        "~/.ssh/arm-key.pub"
        ```

    1. `location = "West US"`: The way the AzureRM provider is implemented forces us to specify the `location` in the module. If you want to use a different region replace `location` with your desired region.

1. Enterprise users, uncomment/comment the section for the variant to look like this, inserting the location to your license key. [enterprise type="inline" size="small" /]

    ```bash
    dcos_variant              = "ee"
    dcos_license_key_contents = "${file("./license.txt")}"
    # dcos_variant = "open"
    ```

1. This sample configuration file will get you started on the installation of an open source DC/OS 1.10.8 cluster with the following nodes:

    - 1 Master
    - 2 Private Agents
    - 1 Public Agent

    If you want to change the cluster name or vary the number of masters/agents, feel free to adjust those values now as well. Cluster names must be unique, consist of alphanumeric characters, '-', '_' or '.', start and end with an alphanumeric character, and be no longer than 24 characters. You can find additional [input variables and their descriptions here](/1.10/installing/evaluation/mesosphere-supported-methods/azure/advanced-azure/).

    There are also simple helpers listed underneath the module which find your public ip and specify that the following output should be printed once cluster creation is complete:

    - `master-ips` A list of Your DC/OS master nodes
    - `cluster-address` The URL you use to access DC/OS UI after the cluster is setup.
    - `public-agent-loadbalancer` The URL of your Public routable services.

1. Check that you have inserted your cloud provider and public key paths to `main.tf`, changed or added any other additional variables as wanted, then save and close your file.

1. Now the action of actually creating your cluster and installing DC/OS begins. First, initialize the project's local settings and data.  Make sure you are still working in the `dcos-tf-azure-demo` folder where you created your `main.tf` file, and run the initialization.

    ```bash
    terraform init
    ```

    ```text
    Terraform has been successfully initialized!

    You may now begin working with Terraform. Try running "terraform plan" to see
    any changes that are required for your infrastructure. All Terraform commands
    should now work.

    If you ever set or change modules or backend configuration for Terraform,
    rerun this command to reinitialize your environment. If you forget, other
    commands will detect it and remind you to do so if necessary.
    ```

    <p class="message--note"><strong>Note: </strong>If terraform is not able to connect to your provider, ensure that you are logged in and are exporting your credentials. See the <a href="https://www.terraform.io/docs/providers/azurerm/#creating-credentials">Azure Provider</a> instructions for more information.</p>

1. After Terraform has been initialized, the next step is to run the execution plan and save it to a static file - in this case, `plan.out`.

    ```bash
    terraform plan -out=plan.out
    ```

    Writing our execution plan to a file allows us to pass the execution plan to the `apply` command below as well help us guarantee the accuracy of the plan. Note that this file is ONLY readable by Terraform.

    Afterwards, we should see a message like the one below, confirming that we have successfully saved to the `plan.out` file.  This file should appear in your `dcos-tf-azure-demo` folder alongside `main.tf`.

      <p align=center>
      <img src="./images/install/terraform-plan.png" />
      </p>

    Every time you run `terraform plan`, the output will always detail the resources your plan will be adding, changing or destroying.  Since we are creating our DC/OS cluster for the very first time, our output tells us that our plan will result in adding 38 pieces of infrastructure/resources.

1. The next step is to get Terraform to build/deploy our plan.  Run the command below.

    ```bash
    terraform apply plan.out
    ```

    Sit back and enjoy! The infrastructure of your DC/OS cluster is being created while you watch. This may take a few minutes.

    Once Terraform has completed applying our plan, you should see output similar to the following:

    <p align=center>
    <img src="./images/install/terraform-apply.png" />
    </p>

    And congratulations - you’re up and running!

# Logging in to DC/OS

1. To login and start exploring your cluster, navigate to the `cluster-address` listed in the output of the CLI. From here you can choose your provider to create the superuser account [oss type="inline" size="small" /], or login with your specified Enterprise credentials [enterprise type="inline" size="small" /].

<p align=center>
<img src="./images/install/dcos-login.png" />
</p>

<p align=center>
<img src="./images/install/dcos-ui.png" />
</p>

# Scaling Your Cluster
Terraform makes it easy to scale your cluster to add additional agents (public or private) once the initial cluster has been created. Simply follow the instructions below.

1. Increase the value for the `num_private_agents` and/or `num_public_agents` in your `main.tf` file. In this example we are going to scale our cluster from 2 private agents to 3, changing just that line, and saving the file.

    ```bash
    num_masters        = "1"
    num_private_agents = "3"
    num_public_agents  = "1"
    ```

1. Now that we’ve made changes to our `main.tf`, we need to re-run our new execution plan.

    ```bash
    terraform plan -out=plan.out
    ```

    Doing this helps us to ensure that our state is stable and to confirm that we will only be creating the resources necessary to scale our Private Agents to the desired number.

    <p align=center>
    <img src="./images/scale/terraform-plan.png" />
    </p>

    You should see a message similar to above.  There will be 3 resources added as a result of scaling up our cluster’s Private Agents (1 instance resource & 2 null resources which handle the DC/OS installation & prerequisites behind the scenes).

1. Now that our plan is set, just like before, let’s get Terraform to build/deploy it.

    ```bash
    terraform apply plan.out
    ```

    <p align=center>
    <img src="./images/scale/terraform-apply.png" />
    </p>

    Once you see an output like the message above, check your DC/OS cluster to ensure the additional agents have been added.

    You should see now 4 total nodes connected like below via the DC/OS UI.

    <p align=center>
    <img src="./images/scale/node-count-4.png" />
    </p>

# Upgrading Your Cluster

Terraform also makes it easy to upgrade our cluster to a newer version of DC/OS. If you are interested in learning more about the upgrade procedure that Terraform performs, please see the official [DC/OS Upgrade documentation](/1.10/installing/production/upgrading/).

1. In order to perform an upgrade, we need to go back to our `main.tf` and modify the current DC/OS Version (`dcos_version`) to a newer version, such as `1.10.9` for this example, and also specify an additional parameter (`dcos_install_mode`). By default this parameter is set to `install`, which is why we were able to leave it unset when creating the initial DC/OS cluster and scaling it.

    <p class="message--important"><strong>IMPORTANT: </strong>Do not change any number of masters, agents or public agents while performing an upgrade.</p>

    ```hcl
    dcos_version = "1.10.9"
    ```

1. Re-run the execution plan, temporarily overriding the default install mode by setting the flag to read in the extra variable.

    ```bash
    terraform plan -out=plan.out -var dcos_install_mode=upgrade
    ```

    You should see an output like below, with your `main.tf` now set for normal operations on a new version of DC/OS.

    <p align=center>
    <img src="./images/upgrade/terraform-plan.png" />
    </p>

1. Apply the plan.

    ```bash
    terraform apply plan.out
    ```

    Once the apply completes, you can verify that the cluster was upgraded via the DC/OS UI.

    <p align=center>
    <img src="./images/upgrade/cluster-details-open.png" />
    </p>

# Deleting Your Cluster

If you want to destroy your cluster, then use the following command and wait for it to complete.

```bash
terraform destroy
```

<p class="message--important"><strong>Important: </strong>Running this command will cause your entire cluster and all at its associated resources to be destroyed. Only run this command if you are absolutely sure you no longer need access to your cluster.</p>

You will be required to enter `yes` to verify.

<p align=center>
<img src="./images/destroy/terraform-destory.png" />
</p>