---
layout: layout.pug
navigationTitle: Check component integrity
title: Check component integrity
menuWeight: 1
excerpt: Run Konvoy commands to check the status and operation for cluster components
enterprise: false
---

Each **Konvoy** cluster includes several key components that are required to ensure proper cluster operations.
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
This process will take about 1 minutes to complete (additional time may be required for larger clusters), do you want to continue [y/n]: y

STAGE [Running Preflights]

PLAY [Check Machine Readiness] ***********************************************************************************************************************************************

TASK [Gathering Facts] *******************************************************************************************************************************************************
ok: [10.0.195.156]
ok: [10.0.128.10]

TASK [preflights : check memory swap is disabled] ****************************************************************************************************************************
ok: [10.0.195.156]
ok: [10.0.128.10]
<... other checks>
PLAY RECAP *******************************************************************************************************************************************************************
10.0.128.10                : ok=10   changed=0    unreachable=0    failed=0
10.0.195.156               : ok=9    changed=0    unreachable=0    failed=0
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
This process will take about 1 minutes to complete (additional time may be required for larger clusters), do you want to continue [y/n]: y

STAGE [Checking Addons]
helm                                                                   [OK]
awsebscsiprovisioner                                                   [OK]
traefik                                                                [OK]
velero                                                                 [OK]
```

The `konvoy check addons` command is particularly useful as the first step to take if you need to to diagnose issues with addon components in the cluster.
For example, this command highlights whether any addons have problems by providing information about any errors or failures detected.

## Check Kubernetes

You can check the underlying Kubernetes control plane by running the following command:

```bash
konvoy check kubernetes
```

The command then displays output similar to the following:

```text
This process will take about 1 minutes to complete (additional time may be required for larger clusters), do you want to continue [y/n]: y

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
This process will take about 1 minutes to complete (additional time may be required for larger clusters), do you want to continue [y/n]: y

STAGE [Checking Nodes]

PLAY [Check Nodes] ***********************************************************************************************************************************************************

<... various check output>

TASK [check-nodes : kube-scheduler health] ***********************************************************************************************************************************
skipping: [10.0.128.10]
ok: [10.0.195.156]

PLAY RECAP *******************************************************************************************************************************************************************
10.0.128.10                : ok=12   changed=0    unreachable=0    failed=0
10.0.195.156               : ok=15   changed=0    unreachable=0    failed=0
```
