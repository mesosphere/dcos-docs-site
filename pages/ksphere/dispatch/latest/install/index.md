---
layout: layout.pug
navigationTitle:  Installation
title: Dispatch Installation
menuWeight: 20
beta: true
excerpt: Install and Configure Dispatch into an existing Kubernetes Cluster.
---

# Installing Dispatch into a D2iQ Konvoy Cluster

The easiest way to install Dispatch is on Konvoy. 

1. In your `cluster.yaml`, set the Dispatch addon field `enabled` to `true`:

    ```bash
    apiVersion: konvoy.mesosphere.io/v1beta1
    kind: ClusterConfiguration
    spec:
      addons:
      - addonsList:
        - enabled: true
          name: dispatch
    ```

1. Run the command `konvoy up` to install Dispatch into the cluster.

## Installing Dispatch into a non-Konvoy Cluster

To install Dispatch, be sure that you have a cluster with Tiller installed. If you are using a Konvoy cluster, you are already set.

### Install Tiller

  ```bash
  kubectl create serviceaccount -n kube-system tiller
  kubectl create clusterrolebinding tiller --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
  helm init --wait --service-account tiller
  ```

## Installing Dispatch into a Cluster

To install Dispatch into a Kubernetes cluster:

1. Execute the command `dispatch init`:

    ```bash
    dispatch init
    ```

1. Set `--namespace` to install Dispatch into a namespace other than `dispatch`. 
1. If you want to restrict the namespaces that Dispatch has access to, set the `--watch-namespace` flag for each namespace Dispatch should have access to.

This will take several minutes, but your Dispatch cluster will be fully ready for use once it is completed.

## Next steps

At this point, you've successfully installed Dispatch. Next,
you will add a new application to Dispatch CI. To do so, follow the steps
at [Setting up a repository to use Dispatch](../repo-setup/).
