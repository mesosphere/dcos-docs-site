---
layout: layout.pug
excerpt: Guide for upgrading of DC/OS Mixed OS cluster on AWS
title: Upgrade DC/OS on AWS using the Universal Installer
navigationTitle: AWS
menuWeight: 20
model: /mesosphere/dcos/2.1/data.yml
render: mustache
---

# Upgrade DC/OS for Windows on Amazon Web Services

This document describes how to upgrade a DC/OS mixed OS cluster. This feature is only supported on a DC/OS version higher than 2.1.0 - Beta1.

Use the Universal Installer​ to configure a DC/OS bootstrap node, a master node (Linux) with public and private Linux agents, plus private Windows mesos-agents​.

## Supported Features
- User can upgrade a hybrid cluster using the Universal Installer.
- User can upgrade a hybrid cluster using similar [instructions](/mesosphere/dcos/2.0/installing/production/upgrading/).

## Limitations
- Upgrading to the same version of DC/OS isn’t possible; the DC/OS version must be immutable.
- [dcos_version_specifier](https://github.com/dcos/dcos-ansible/blob/master/roles/dcos_bootstrap/tasks/main.yml#L60) needs to be changed to have a diff folder for installation artifacts.

### Update the file, main.tf.

In case you have the **main.tf** and state file of an existing cluster, use them for an upgrade. Otherwise, you can use the latest main.tf located [here](https://github.com/dcos-terraform/examples/tree/feature/windows-support-beta/aws/windows-agent). Clone the repository locally, then set the required changes described below:
- Check if [ansible_bundled_container](https://github.com/dcos-terraform/examples/blob/cee508a3e1c411e9d1cd20aefe7ebe9dd81464f7/aws/windows-agent/main.tf#L37) is set to "mesosphere/dcos-ansible-bundle:windows". Please change if not.
- Check the [Cluster name](https://github.com/dcos-terraform/examples/blob/6ef4000d8315c8dc7b8cfad3a39ee6f9a0d83194/aws/windows-agent/main.tf#L9). It should be the same as an existing cluster.
- [Set up SSH credentials for your cluster](/mesosphere/dcos/2.0/installing/evaluation/aws/)
- Check if the path to your ssh public key is correct.
- Check if the path to your license file is correct.
- Save the **main.tf** file to a location that is accessible from the command line.

After you have prepared your environment for the upgrade, you are ready to start the process.
- Start a command-line interface such as bash, sh or WSL/WSL2.
- Change the working directory to the place where you saved your **main.tf** file and execute the Terraform commands:
```terraform init```
```terraform apply```

[Check the status of the upgrade](/mesosphere/dcos/2.1/tutorials/windows/upgrade/check-upgrade/).
