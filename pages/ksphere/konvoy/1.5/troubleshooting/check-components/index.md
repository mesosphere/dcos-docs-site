---
layout: layout.pug
navigationTitle: Check component integrity
title: Check component integrity
menuWeight: 1
excerpt: Run Konvoy commands to check the status and operation for cluster components
enterprise: false
---

Each **Konvoy** cluster includes several required key components to ensure proper cluster operations.
The `konvoy` command-line interface (CLI) provides a subcommand that you can use to verify the integrity of these components.

The topics in this section describe how you can use the `konvoy check` subcommands to determine the status of key cluster components and verify that the cluster is operating correctly.

## Using the pre-flight check

You can use the Konvoy pre-flight checks to verify the readiness of Linux servers.
The pre-flight checks help you determine whether computers meet the minimum requirements for deploying Kubernetes.

You can start the pre-flight check by running the following command:

```bash
konvoy check preflight
```

The command then displays output similar to the following:

```text
STAGE [Running Preflights]

PLAY [Bootstrap Bastion Nodes] *********************************************************************************************************************************************
skipping: no hosts matched

PLAY [Bootstrap Nodes] *****************************************************************************************************************************************************

TASK [wait-ssh : wait 180 seconds for SSH target connection to become reachable (socket)] **********************************************************************************
ok: [10.0.128.252 -> localhost]
ok: [10.0.194.33 -> localhost]
ok: [10.0.128.170 -> localhost]
ok: [10.0.193.146 -> localhost]
ok: [10.0.192.97 -> localhost]
ok: [10.0.131.119 -> localhost]
ok: [10.0.131.17 -> localhost]

TASK [wait-ssh : wait 180 seconds for SSH target connection to become reachable (SSH)] *************************************************************************************
skipping: [10.0.128.170]
skipping: [10.0.131.17]
skipping: [10.0.128.252]
skipping: [10.0.131.119]
skipping: [10.0.194.33]
skipping: [10.0.193.146]
skipping: [10.0.192.97]
<... other checks>
PLAY RECAP *****************************************************************************************************************************************************************
10.0.128.170               : ok=22   changed=0    unreachable=0    failed=0
10.0.128.252               : ok=18   changed=0    unreachable=0    failed=0
10.0.131.119               : ok=18   changed=0    unreachable=0    failed=0
10.0.131.17                : ok=18   changed=0    unreachable=0    failed=0
10.0.192.97                : ok=17   changed=0    unreachable=0    failed=0
10.0.193.146               : ok=17   changed=0    unreachable=0    failed=0
10.0.194.33                : ok=17   changed=0    unreachable=0    failed=0
```

The pre-flight command is particularly useful if you are providing your own infrastructure for the Kubernetes deployment.
For example, you can use the `konvoy check preflight` command to verify your hosts' configuration and state before running the `konvoy deploy` command to deploy your Kubernetes infrastructure.

## Check addons

By default, Konvoy deploys several addon applications.
You can check the integrity for these addons by running the following command:

```bash
konvoy check addons
```

The command then displays output similar to the following:

```text
STAGE [Checking Addons]
awsebscsiprovisioner                                                   [OK]
cert-manager                                                           [OK]
dashboard                                                              [OK]
defaultstorageclass-protection                                         [OK]
<... other addons>
```

The `konvoy check addons` command is particularly useful as the first step in diagnosing issues with addons in the cluster.
This command highlights whether any addon has problems by providing information about errors or failures detected.

## Check Kubernetes

You can verify the state of the Kubernetes cluster by running the following command:

```bash
konvoy check kubernetes
```

The command then displays output similar to the following:

```text
STAGE [Checking Kubernetes]

PLAY [Check Control Plane Health] ********************************************************************************************************************************************

TASK [Gathering Facts] *******************************************************************************************************************************************************
ok: [10.0.195.156]
ok: [10.0.128.10]

TASK [check-kubernetes : calico health] **************************************************************************************************************************************
ok: [10.0.128.10 -> ec2-34-222-69-18.us-west-2.compute.amazonaws.com]
ok: [10.0.195.156 -> ec2-34-222-69-18.us-west-2.compute.amazonaws.com]

TASK [check-kubernetes : coredns health] *************************************************************************************************************************************
ok: [10.0.128.10 -> ec2-34-222-69-18.us-west-2.compute.amazonaws.com]

TASK [check-kubernetes : count number of nodes] ******************************************************************************************************************************
ok: [10.0.128.10 -> ec2-34-222-69-18.us-west-2.compute.amazonaws.com]

TASK [check-kubernetes : check nodes are Ready] ******************************************************************************************************************************
ok: [10.0.128.10 -> ec2-34-222-69-18.us-west-2.compute.amazonaws.com]

PLAY RECAP *******************************************************************************************************************************************************************
10.0.128.10                : ok=5    changed=0    unreachable=0    failed=0
10.0.195.156               : ok=2    changed=0    unreachable=0    failed=0
```

## Check nodes

You can check whether nodes are in the right condition for Kubernetes operations by running the following command:

```bash
konvoy check nodes
```

The command then displays output similar to the following:

```text
STAGE [Running Preflights]

PLAY [Bootstrap Bastion Nodes] *********************************************************************************************************************************************
skipping: no hosts matched

PLAY [Bootstrap Nodes] *****************************************************************************************************************************************************

TASK [wait-ssh : wait 180 seconds for SSH target connection to become reachable (socket)] **********************************************************************************
ok: [10.0.131.119 -> localhost]
ok: [10.0.128.170 -> localhost]
ok: [10.0.193.146 -> localhost]
ok: [10.0.192.97 -> localhost]
ok: [10.0.128.252 -> localhost]
ok: [10.0.131.17 -> localhost]
ok: [10.0.194.33 -> localhost]
<... various preflight check output>

STAGE [Checking Nodes]

PLAY [Check Machine Readiness] *********************************************************************************************************************************************

TASK [Gathering Facts] *****************************************************************************************************************************************************
ok: [10.0.194.33]
ok: [10.0.131.17]
ok: [10.0.128.170]
ok: [10.0.128.252]
ok: [10.0.193.146]
ok: [10.0.192.97]
ok: [10.0.131.119]
<... various node check output>

TASK [check-nodes : kube-scheduler health] *********************************************************************************************************************************
skipping: [10.0.128.170]
skipping: [10.0.131.17]
skipping: [10.0.128.252]
skipping: [10.0.131.119]
ok: [10.0.194.33]
ok: [10.0.193.146]
ok: [10.0.192.97]

PLAY RECAP *******************************************************************************************************************************************************************
10.0.128.10                : ok=12   changed=0    unreachable=0    failed=0
10.0.195.156               : ok=15   changed=0    unreachable=0    failed=0
```

The first stage consists of `Preflights` which check to ensure that node settings have not been changed.
The second stage verifies all nodes are operational.
