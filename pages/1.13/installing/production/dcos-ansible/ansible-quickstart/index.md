---
layout: layout.pug
title: DC/OS Ansible Quickstart Guide
navigationTitle: Ansible Quickstart
menuWeight: 1
excerpt: Guided walkthrough of installing DC/OS using Ansible.
---

If you’re new to Ansible and/or want to deploy DC/OS using Ansible quickly and effortlessly - please follow this guide. We’ll walk you through step-by-step on how to:
- Download DC/OS Ansible Content
- Configure Ansible for DC/OS
- Create a DC/OS cluster with Ansible
- Upgrade the cluster to a newer version of DC/OS

## Prerequisites and Setup
1. You will need to have [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) and [Mazer](https://galaxy.ansible.com/docs/mazer/install.html) installed. See links for additional installation information.
     With Mac you can brew install and then use your version of pip to install mazer:
     ```bash
     brew install ansible && pip install mazer
     ```
     Or, you can use pip to install Ansible and Mazer:

      ```bash
      pip install ansible mazer
      ```
     For windows installation please refer to the [Ansible documentation](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#control-machine-requirements) for more information on how to install ansible on windows, or you can SSH to the bootstrap host (see below) and deploy and run ansible from there.

2. A list of your cluster nodes configured with SSH access. You will need a minimum of 4 nodes (CentOS or RedHat), available with SSH connectivity via a user with root level privileges:
   - 1 Bootstrap
   - 1 Master
   - 1 Private Agent
   - 1 Public Agent

Please see the [minimum system requirements](/1.13/installing/production/system-requirements/) and supported CentOS and Redhat Enterprise Linux (RHEL) [versions for your nodes](/version-policy/#dcos-platform-version-compatibility-matrix/), especially when planning for production environments.
For more information on setting up SSH connections for Ansible see the [remote connections documentation](https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html#remote-connection-information).
If you are installing DC/OS Enterprise Edition, you will also need an appropriate license key.

<p class="message--note"><strong>Note: </strong>Registered Enterprise customers can access the DC/OS Enterprise configuration file from the <a href="https://support.mesosphere.com/s/downloads">support website</a>. For new customers, please contact your sales representative or <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a> for more information.</p>

## Downloading the Content
We maintain and host our [DC/OS Ansible project on the Ansible Galaxy](https://galaxy.ansible.com/dcos/dcos_ansible) for easy consumption. Currently we, as well as RedHat, propose using the Mazer tool for downloading all the necessary content locally to your machine. For more information on the Mazer tool and how to configure it see the [project docs here](https://galaxy.ansible.com/docs/mazer/index.html).

1. Issue the following command to download the content:
     ```bash
     mazer install dcos.dcos_ansible
     ```

     This will install content in ` ~/.ansible/collections/ansible_collections` by default. However, if you have an older version of `mazer` or have a different content path set in your `mazer.yml`, it will install there. You can issue `mazer version` to find location your config file for mazer.

2. In your content path, switch to the dcos_ansible roles.
     ```bash
     cd ~/.ansible/collections/ansible_collections/dcos/dcos_ansible
     ```

3. Mazer will download your roles by version in this directory, for example `dcos-ansible-0.51.0`. Locate the version and switch directories to the desired version for the next steps:
   ```bash
   cd dcos-ansible-0.51.0
   ```

## Configuring Ansible for your DC/OS cluster
Once you have downloaded the content locally, you can begin modifying it to fit your specific needs. You will need to configure the following files to get started:
- Inventory file (`inventory`) - You will specify your which of your nodes will be used as bootstrap, master(s), private agent(s) or public agent(s).
- Group Variables file (`/group_vars/all/dcos.yml`) - This file is used to manage OS prereqs as well as how to install and configure DC/OS.
- Ansible Config (`ansible.cfg`) - How you prefer Ansible to run in your environment. Most likely defaults are good here except for `remote_user`.

You may use DC/OS Ansible to install both DC/OS and DC/OS Enterprise. Please follow the below instructions and adjust according to your variant where noted. Here, we will install version `1.12.3`.

1. Within the `~/.ansible/collections/ansible_collections/dcos/dcos_ansible/dcos-ansible-X.X.X` directory, rename the inventory and group variables example files to new files:
     ```bash
     mv inventory.example inventory && \
     mv group_vars/all/dcos.yaml.example group_vars/all/dcos.yml
     ```

2. Place each of your corresponding nodes, as mentioned in the prerequisites, under the desired groups in the `inventory` file for `[bootstrap]`, `[masters]`, `[agents_private]` and `[agents_public]` groups. If you are deploying on a public cloud, those are the external IPs of the nodes.

3. In the variables file (`group_vars/all/dcos.yml`), set the following values under `dcos` according to your variant:

    [enterprise type="inline" size="small" /]
    ```bash
    # ...
    download: “http://downloads.mesosphere.com/dcos-enterprise/stable/1.12.3/dcos_generate_config.ee.sh”`
    # ...
    ```

    [oss type="inline" size="small" /]
    ```bash
    # ...
    download: “https://downloads.dcos.io/dcos/stable/1.12.3/dcos_generate_config.sh”
    version: “1.12.3
    enterprise_dcos: false
    # ...
    ```

4. Also in the variables file, set the following values under `config`. Enterprise users add your license key here:
    ```bash
    # ...
    cluster_name: <your-cluster-name>

    # The Hostname or IP of you bootstrap node at port 8080 (If you are deploying on a public cloud, this is the private IPs of the node)
    bootstrap_url: <bootstrap-IP-or-hostname>:8080

    # Change the value(s) list to the IP(s) of your master node(s) used in the [master] inventory group. (If you are deploying on a public cloud, those are the private IPs of the node)
    master_list:
      - IP1
      - IP2

    # Add and uncomment this line for enterprise; paste or pass in your license key here
    # license_key_contents: “YOUR_ENT_LICENSE_CONTENTS”
    ```

5. (Optional) In `ansible.cfg`, set the appropriate `remote_user` to the user that you will connect as on your nodes. The default is set to `centos`.

## Confirming your setup
To test that you have everything set up correctly, use the ping module and ensure connectivity to all of your nodes:
```bash
ansible -m ping all
```
Which should return:
```bash
bootstrap | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
master | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
private-agent | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
public-agent | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

## Creating the DC/OS Cluster
We have provided a simple playbook to run the entire process of installing and managing DC/OS including all prerequisites based on your OS. The version of DC/OS that will be installed is based on the value you have configured in your variables file for `download` and `version`. The values are the most important to installing and upgrading your cluster.

To install DC/OS run the following command to execute the playbook.

```bash
ansible-playbook dcos.yml
```

**Note: Prior to DC/OS Install you will be required to either press ENTER to continue with install or CTRL-C to cancel install.**

```bash
TASK [DCOS.bootstrap : Double check the prefix/cluster name and version]
****************************************************************************************************************
[DCOS.bootstrap : Double check the prefix/cluster name and version]
Please double check the prefix/cluster name and version of this cluster:

  Cluster: dcosansible
  Version: 1.12.3 -> 1.12.3
  Commit:  None
  via:     http://downloads.mesosphere.com/dcos-enterprise/stable/1.12.3/dcos_generate_config.ee.sh

PRESS *ENTER* OR CANCEL NOW IF IT ISN'T CORRECT
```

When ansible is completed, you should see an output with no errors like below:

```bash
PLAY RECAP ****************************************************************************************************************
bootstrap                  : ok=24   changed=5    unreachable=0    failed=0
master                     : ok=24   changed=5    unreachable=0    failed=0
private_agent              : ok=24   changed=5    unreachable=0    failed=0
public_agent               : ok=24   changed=5    unreachable=0    failed=0
```

With very little effort we have created a DC/OS version running version 1.12.2. You can now access DC/OS via your master node(s) at: `http://master-node-ip`

## Logging In
To access the user interface, you will be asked to log in.

If you installed DC/OS Enterprise, you can login with default demo credentials. [enterprise type="inline" size="small" /]

```
user: bootstrapuser
password: deleteme
```
![enterprise-Login-Page](/1.13/img/dcos-ee-login.png)



If you installed DC/OS Open Source, select the OAuth provider of your choice. [oss type="inline" size="small" /]

![oss-login-page](/1.13/img/dcos-oe-login.png)


## Creating test instances on AWS with terraform
If you would like to test the above steps on AWS and are familiar with terraform, please [download and use this terraform script](https://gist.github.com/geekbass/45eb978fb420ae0da13f00fdfa0cd1c5) to deploy a sample infrastructure so that you can deploy DC/OS on it using the ansible script above. The script is not officially supported by Mesosphere and is provided only for testing purposes.

To deploy the infra using the script:

1. Create a new folder
2. Copy the above script to a file named main.tf
3. Initialize terraform: terraform init
4. Deploy the infrastructure using terraform apply

Final output should be something like this:

```bash
Apply complete! Resources: 32 added, 0 changed, 0 destroyed.

Outputs:

bootstrap_private_ip = 172.12.15.101
bootstraps = 3.87.63.8
cluster-address = dcosansible-660064571.us-east-1.elb.amazonaws.com
masters = 100.27.19.199
54.196.221.181
35.168.16.40
masters_private_ips = 172.12.6.95
172.12.29.65
172.12.42.160
private_agents = 34.207.192.11
3.80.226.211
3.85.31.136
public-agents-loadbalancer = ext-dcosansible-1616099901.us-east-1.elb.amazonaws.com
public_agents = 3.86.34.141
```


