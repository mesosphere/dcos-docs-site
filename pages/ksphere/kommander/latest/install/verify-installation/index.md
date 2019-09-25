---
layout: layout.pug
navigationTitle: Verify Konvoy installation
title: Verify Konvoy installation
menuWeight: 80
excerpt: Check Konvoy components to verify the status of your cluster
enterprise: false
---

In this section, we walk you through how to verify a Konvoy installation.

## Use the Konvoy check command

Konvoy ships with some default diagnosis tools to check your cluster (i.e., the `check` command).
You can use those tools to validate your installation.

```bash
konvoy check
```

The `check` command will validate all nodes components including container runtime, the kubernetes control plane, and all addons.
See more details about what those commands do [here][troubleshooting_tools].
If your install is successful, all the above commands should return success.

## Verify all pods are running

All pods install by Konvoy (i.e., addons) should be in `Running` or `Completed` status if the install is successful.

```bash
kubectl get pods --all-namespaces
```

If any pod is not in `Running` or `Completed` status, please refer to the [troubleshooting guide][troubleshooting] for how to troubleshooting the issues.

## Verify operation portal is working properly

Last but not least, please verify that the operational portal is working properly.
Please refer to this [guide][opsportal] for how to use the operational portal.

[troubleshooting_tools]: ../../troubleshooting/tools-and-techniques/
[troubleshooting]: ../../troubleshooting/
[opsportal]: ../../operations/accessing-the-cluster/
