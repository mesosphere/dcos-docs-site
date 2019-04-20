---
layout: layout.pug
title: DC/OS Ansible FAQs/Troubleshooting
navigationTitle: DC/OS Ansible FAQ
menuWeight: 2
excerpt: Frequently asked questions and common issues when working with Ansible
---
#

For convenient and customizable DC/OS Cluster lifecycle management, we have created the DC/OS Ansible project which utilizes Ansible for its simplified and flexible configuration management benefits. These roles are responsible for handling DC/OS installation as well as DC/OS upgrades procedures across all cluster nodes automatically. These roles have been built with intelligence to make decisions based on facts, handle error checking as well as idempotent so that undesired changed are not made unless specified.

We have broken down the lifecycle management of DC/OS into 4 roles to handle the different management aspects of DC/OS such as cluster prerequisites, bootstrap tasks, master tasks, private agent tasks and public agent tasks. Each role can be read about more below:

- Prerequisites - This roles handles all of the [requirements to run DC/OS](https://docs.mesosphere.com/1.12/installing/production/system-requirements/#software-prerequisites).
- Bootstrap - The Boostrap role handles all tasks associated with downloading, generating and serving the DC/OS install and upgrade scripts to all nodes in the cluster.
- Master - These tasks include downloading install and upgrade files from the Bootstrap node as well as handling some checks to ensure that upgrade has gone accordingly. It will back out upgrades if there problems keeping the cluster from going into an undesired state.
- Agents - These task handle all upgrade and installation tasks for ALL agent types.

Currently these roles support Centos7 and RHEL7 operating systems. These couple potentially be in cloud environments such as AWS, Azure or GCP as well as on prem deployments.



### Table of Contents
- [Official Docs and Links](#official-docs-and-links)
- [New to Ansible](#new-to-ansible)
- [Setting up ssh](#setting-up-ssh)
- [Connection timeout to node](#connection-timeout-to-node)
- [No inventory file provided](#no-inventory-file-provided)
- [Wrong remote_user configured](#wrong-remoteuser-configured)
- [Failure downloading URL](#failure-downloading-url)
- [Mazer install directory](#mazer-install-directory)
- [DC/OS Install or Upgrade fails after replacing Bootstrap Node](#dcos-install-or-upgrade-fails-after-replacing-bootstrap-node)
- [Config changes and/or Upgrading DC/OS Versions](#config-changes-andor-upgrading-dcos-versions)


## Official Docs and Links
DC/OS Ansible repo is hosted on Github publicly [here](https://github.com/dcos/dcos-ansible):

The official Ansible Galaxy page and versions can be found [here](https://galaxy.ansible.com/dcos/dcos_ansible):

## New to Ansible
If you are new to Ansible, it is highly recommended that you first have a look at the [Getting Started](https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html#remote-connection-information) guide. This will better explain and show how we use Ansible to successfully manage the DC/OS Lifecycle.

## Setting up ssh
SSH is the protocol that which Ansible uses to connect and manage hosts via an inventory file. If you need to setup ssh connections between your Ansible control machine and its managed nodes, see the following [Ansible docs](https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html#remote-connection-information).

You can then test connection via the following:
```
ansible -m ping all
```

If you are still getting ssh errors, ensure that you are trying to connect with the correct `remote_user`. Default for this project is `centos` which could be different in your case.

Also if you have a different `ansible.cfg`, it could also be an issue with `host_key_checking`. You could either set this to `False` and try again or ensure that the correct key is added to your ssh agent. You can check that your key is add via:

```
ssh-add -l # for a list of keys
ssh-add ~/your/key # to add to ssh agent
```

## Connection timeout to node
At times if your network or your node is busy, it is possible to have a timeout such as:

```
FAILED! => {"failed": true, "msg": "ERROR! Timeout (12s) waiting for privilege escalation prompt: "}
```

You can simply rerun the playbook again to see if ssh connects successfully the next time it runs. It will only make changes to the appropriate nodes.

If you attempt this multiple times and continue to get the error without a successful run, you should likely begin troubleshooting the instance to see if there is a problem with the node.

## No inventory file provided
When issuing an Asible command you get the following error:
```
[WARNING]: Unable to parse /etc/ansible/hosts as an inventory source

[WARNING]: No inventory was parsed, only implicit localhost is available

[WARNING]: provided hosts list is empty, only localhost is available. Note that the implicit localhost does not match 'all'
```
Ensure that you are in a directory that contains an inventory file. For more information about inventory files read the [Ansible docs](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html#intro-inventory).

## Wrong remote_user configured
If you are getting errors connecting to machines like below:
```
fatal: [agent2-testsre.sre.mesosphe.re]: UNREACHABLE! => {"changed": false, "msg": "SSH Error: data could not be sent to remote host \"agent2-testsre.sre.mesosphe.re\". Make sure this host can be reached over ssh", "unreachable": true}
```

If could be that you attempting to connect with the incorrect remote_user. Please check with your `ansible.cfg` or run command with correct remote user.
```
Failure generating config
fatal: [172.16.2.65]: FAILED! => {"changed": true, "cmd": ["bash", "dcos_generate_config.ee.sh"], "delta": "0:00:02.724998", "end": "2019-04-08 17:50:51.568479", "msg": "non-zero return code", "rc": 1, "start": "2019-04-08 17:50:48.843481", "stderr": "\u001b[33m====> EXECUTING CONFIGURATION GENERATION\u001b[0m\nGenerating configuration files...\n\u001b[1;31mbouncer_expiration_auth_token_days: bouncer_expiration_auth_token_days must be a number of days or decimal thereof.\u001b[0m", "stderr_lines": ["\u001b[33m====> EXECUTING CONFIGURATION GENERATION\u001b[0m", "Generating configuration files...", "\u001b[1;31mbouncer_expiration_auth_token_days: bouncer_expiration_auth_token_days must be a number of days or decimal thereof.\u001b[0m"], "stdout": "", "stdout_lines": []}
module.dcos.module.dcos-install.module.dcos-install.null_resource.run_ansible_from_bootstrap_node_to_install_dcos (remote-exec): 	to retry, use: --limit @/dcos_playbook.retry
```

The above error is not actually an Ansible error but an error that is being issued from the dcos generate config script. Please ensure that you have correct key values for your DC/OS Configs. Please see the DC/OS documentation for [configuration reference](https://docs.mesosphere.com/1.12/installing/production/advanced-configuration/configuration-reference/).

## Failure downloading URL
Ensure that you have specified a correct URL for your version of DC/OS that you are trying to install. You can find the available links via the following:

- [EE](https://support.mesosphere.com/s/downloads)
- [Open](https://dcos.io/releases/)

## Mazer install directory
Different versions of Mazer or custom Mazer installations are maintained via a mazer configuration file. One of these configurations that is maintained in this configuration file is the content_path which is where the content gets installed that is pulled from the galaxy. If you are having issues locating either the content path or the mazer configuration file, please issue the following command to locate the mazer configuration file:
```
mazer version | grep config
```

Inside mazer config file, check the `content_path`. You can see more about the Mazer configuration file here as well as more options.

## DC/OS Install or Upgrade fails after replacing Bootstrap Node
If you need to replace the bootstrap node instance in your cluster you will need to update the new inventory file to reflect as well as the `bootstrap_url` in your variables file. If you receive the following error after you replace the bootstrap node, please ensure that you have updated the variables file as well.

```
TASK [DCOS.master : Upgrade: Run DC/OS master upgrade] **********************************************************************
fatal: [172.12.8.139]: FAILED! => {"changed": true, "cmd": "set -o pipefail; ./dcos_node_upgrade.sh --verbose | systemd-cat -t dcos-upgrade", "delta": "0:00:27.758455", "end": "2019-04-06 00:59:47.232139", "msg": "non-zero return code", "rc": 1, "start": "2019-04-06 00:59:19.473684", "stderr": "ERROR: Unable to fetch package dcos-config--setup_c0495a51346db67a274d71c612d1f0648ead23d0: Problem fetching http://172.12.6.132:8080/1.12.0/genconf/serve/packages/dcos-config/dcos-config--setup_c0495a51346db67a274d71c612d1f0648ead23d0.tar.xz to /tmp/tmp09jvhnfa.tar.xz because of HTTPConnectionPool(host='172.12.6.132', port=8080): Max retries exceeded with url: /1.12.0/genconf/serve/packages/dcos-config/dcos-config--setup_c0495a51346db67a274d71c612d1f0648ead23d0.tar.xz (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f7272a92a90>: Failed to establish a new connection: [Errno 113] No route to host',)). Unable to remove partial download. Future builds may have problems because of it.", "stderr_lines": ["ERROR: Unable to fetch package dcos-config--setup_c0495a51346db67a274d71c612d1f0648ead23d0: Problem fetching http://172.12.6.132:8080/1.12.0/genconf/serve/packages/dcos-config/dcos-config--setup_c0495a51346db67a274d71c612d1f0648ead23d0.tar.xz to /tmp/tmp09jvhnfa.tar.xz because of HTTPConnectionPool(host='172.12.6.132', port=8080): Max retries exceeded with url: /1.12.0/genconf/serve/packages/dcos-config/dcos-config--setup_c0495a51346db67a274d71c612d1f0648ead23d0.tar.xz (Caused by NewConnectionError('<urllib3.connection.HTTPConnection object at 0x7f7272a92a90>: Failed to establish a new connection: [Errno 113] No route to host',)). Unable to remove partial download. Future builds may have problems because of it."], "stdout": "", "stdout_lines": []}
	to retry, use: --limit @/home/centos/ansible_collections/dcos/dcos_ansible/dcos-ansible-0.51.0/dcos.retry

```

## Config changes and/or Upgrading DC/OS Versions
Upgrading versions of DC/OS or DC/OS Config changes are two types of cluster upgrade scenarios that we support. We have made this extremely simple and require very minimal change. Our dcos-ansible tool is able to determine what type of upgrade scenario that you are trying to perform.

- If you are attempting to upgrade the version of DC/OS to a new one, simply modify the `download` and `version` variables in your `dcos.yml` (variable file) to your desired version. Then simply re-run the playbook for the changes to take effect.

- If you would like to change a DC/OS Configuration parameter, such as updating the resolvers, simply make the change to the desired dcos config variable in your `dcos.yml` (variables file) and re-run the playbook. It will detect a change in configs and run the upgrade procedure so the new configs are put in place.