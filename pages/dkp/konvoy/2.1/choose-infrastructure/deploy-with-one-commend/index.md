---
layout: layout.pug
navigationTitle: Deploy Konvoy with One Command
title: Deploy Konvoy with One Command
menuWeight: 50
excerpt: Deploy a Konvoy cluster with a single command
enterprise: false
beta: true
---
You can use a single command line entry to create a Kubernetes cluster on any of the infrastructures supported by DKP. Within your environment, each cluster that you create with the `dkp create cluster` command requires a globally-unique cluster name that you specify as a flag.

The basic DKP deploy command structure is:

```shell
dkp create cluster <provider> --cluster-name=clustername --self-managed --flag1=value --flag2=value ... --flagn=value
```

For a complete list of supported providers, enter the command:

```shell
dkp create cluster --help
```

The default value for the  `--self-managed` flag is false, so you must specify it to enable cluster creation from a single command.

When you execute it, this command:

-   Creates a bootstrap cluster, if one is not present

-   Deploys CAPI controllers on the bootstrap cluster

-   Waits for the cluster to be created, moves the CAPI controllers, and deletes the bootstrap cluster

## Infrastructure-specific flags

Additional flags are available to enable needed features on supported cluster providers, as well as for on-premises and pre-provisioned clusters. You can view additional provider-specific flags and their descriptions with one of the following commands:

```shell
dkp create cluster <provider> --help
```

[set-env-variables][https://www.serverlab.ca/tutorials/linux/administration-linux/how-to-set-environment-variables-in-linux/]
