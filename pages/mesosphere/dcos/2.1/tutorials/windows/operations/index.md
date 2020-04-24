---
layout: layout.pug
navigationTitle: Operations
title: Operations
menuWeight: 10
excerpt: Guide of basic operations on the Windows node
model: /mesosphere/dcos/2.1/data.yml
render: mustache
---

# Operations

After upgrading the cluster, the following components must be running on the Windows node:
- mesos-agent (includes security, metrics, and the container logger modules)
- Adminrouter
- Telegraf
- dcos-diagnostics

<p class="message--note"><strong>Note:</strong> Winpanda manages these services through [NSSM](https://nssm.cc/), which is a program similar to *systemd* for Windows.</p>

The official NSSM website offers a list of [commands](https://nssm.cc/commands) and [use cases](https://nssm.cc/scenarios).

## List NSSM Services

Use this command to print the names of all services managed by NSSM.
```nssm list```

![nssm output](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/nssm-list.png)

## Control Services Using the Command Line

NSSM offers several basic commands for service control:
```nssm start  <servicename>```
```nssm restart <servicename>```
```nssm stop <servicename>```
```nssm dump <servicename>```
```nssm status <servicename>```
```nssm statuscode <servicename>```

![nssm cli](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/nssm-cli.png)

The dcos-agent file and package structure are located in [Winpada doc](https://github.com/dcos/dcos/tree/master/packages/winpanda/extra/src/winpanda/docs#file-structure).

## Supported Instance (Node) OS Versions

The default instance OS for Linux nodes is currently CentOS 7.6 and will be applied by default unless you specify an alternative in the configuration. [Click here](https://github.com/dcos-terraform/terraform-aws-tested-oses/blob/support/0.2.x/variables.tf) to see a list of the instance operating systems supported by DC/OS.

For Windows nodes, the AMI image is predefined [here](https://github.com/dcos-terraform/terraform-aws-windows-instance/blob/ad5a80b014f0f3d5241c14e262981119344d7d1b/main.tf#L31) and you should note that DC/OS for Windows has been fully-tested with only this particular AMI image. To change the default OS, change the parameters mentioned above.
