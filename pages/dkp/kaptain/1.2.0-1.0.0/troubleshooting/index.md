---
layout: layout.pug
navigationTitle: Troubleshooting
title: Troubleshooting Guide
menuWeight: 95
excerpt: Troubleshooting Guide for Kaptain
beta: false
enterprise: false
---

## Konvoy

To create the Konvoy diagnostics bundle, use:

```bash
konvoy diagnose --logs-all-namespaces --yes
```

Afterwards, check [Konvoy troubleshooting techniques](https://docs.d2iq.com/dkp/konvoy/latest/troubleshooting/).

## Kaptain and KUDO

To print the status of the Kaptain operator instance:

```bash
kubectl kudo plan status -n kubeflow --instance kaptain
```

To show deployments and pods in the Kaptain operator instance:

```bash
kubectl get deployments -n kubeflow

kubectl get pods -n kubeflow

kubectl describe pod <pod_name> -n kubeflow
```

To print the logs from the KUDO controller:

```bash
kubectl logs -n kudo-system kudo-controller-manager-0 -f
```

## Limitations

Known limitations for Kaptain are listed here by version.
