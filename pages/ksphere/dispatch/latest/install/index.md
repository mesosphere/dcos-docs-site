---
layout: layout.pug
navigationTitle:  Installation
title: Dispatch Installation
menuWeight: 2
excerpt: Install and Configure Dispatch into an existing Kubernetes Cluster.
---

# Dispatch installation

## Install Dispatch into a D2iQ Konvoy Cluster

The easiest way to install Dispatch is on Konvoy. In your `cluster.yaml`, set the Dispatch addon to enabled:

```
apiVersion: konvoy.mesosphere.io/v1beta1
kind: ClusterConfiguration
spec:
  addons:
  - addonsList:
    - enabled: true
      name: dispatch
```

Now run `konvoy up` to install Dispatch into the cluster.

## Install Dispatch into a non-Konvoy Cluster

### Install Tiller

To install Dispatch, ensure you have a cluster with Tiller installed (if you are using a Konvoy cluster, you are already set):

```
kubectl create serviceaccount -n kube-system tiller
kubectl create clusterrolebinding tiller --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
helm init --wait --service-account tiller
```

### Install Dispatch into a Cluster

To install Dispatch into a kubernetes cluster run:

```bash
dispatch init
```

Set `--namespace` to install Dispatch into a namespace other than `dispatch`. If you want to restrict the namespaces that Dispatch has access to, set the `--watch-namespace` flag for each namespace Dispatch should have access to.

This will take several minutes, but your Dispatch cluster will be fully ready for use once it is completed.

## Next steps

At this point, you've successfully configured your Dispatch installation. Next,
you will add a new application to Dispatch CI. To do so, please follow the steps
at [Setting up a repository to use Dispatch](../repo-setup/).
