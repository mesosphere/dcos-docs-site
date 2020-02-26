---
layout: layout.pug
navigationTitle:  Installation
title: Dispatch Installation
menuWeight: 40
beta: false
excerpt: Install and Configure Dispatch into an existing Kubernetes Cluster.
---

# Prerequisites

## Hardware requirements
Make sure you meet the hardware requirements for Dispatch
<!-- #include /ksphere/dispatch/include/hardware-reqs.tmpl -->

## Supported operating systems for Konvoy deployment

# Prerequisites for installation on Konvoy

If you will be installing Dispatch on Konvoy, be aware that Konvoy supports only the following operating systems:

## CentOS

| OS Release | Kernel Version |
|------------|----------------|
| [CentOS 7.6][centos_7_6] | 3.10.0-957 |

## RHEL

| OS Release | Kernel Version |
|------------|----------------|
| [RHEL 7.6][rhel_7_6] | 3.10.0-957 |

## Ubuntu

| OS Release | Kernel Version |
|------------|----------------|
| [Ubuntu 16.04 (xenial)][ubuntu_16] | 4.4.0-1087 |

## Debian

| OS Release | Kernel Version |
|------------|----------------|
| [Debian 9 (stretch)][debian_9] | 4.9.0-9 |
| [Debian 10 (buster)][debian_10] | 4.19.67-2 |

[centos_7_6]: https://wiki.centos.org/Manuals/ReleaseNotes/CentOS7.1810
[rhel_7_6]: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.6_release_notes/index
[ubuntu_16]: https://wiki.ubuntu.com/XenialXerus/ReleaseNotes
[debian_9]: https://www.debian.org/releases/stretch/releasenotes
[debian_10]: https://www.debian.org/releases/buster/releasenotes

## Supported software packages

---
layout: layout.pug
navigationTitle:  Supported Software Packages
title: Supported Software Packages
menuWeight: 20
beta: false
excerpt: These are the software package versions that Dispatch supports.    
---

# Prerequisites for installation 

## On Konvoy

If you will be installing Dispatch on Konvoy, be aware that Konvoy supports only the following versions of our supported software:

| Package | Version | Description |
|-----|-----|-----|
| [Kubernetes](https://kubernetes.io/) |   | Container orchestration manager  |
| [Prometheus](https://prometheus.io/) |   |  An open-source monitoring system  |
| Tiller | 2.14.2 or later  |   |
| [Traefik](https://docs.traefik.io/) |    |Open source edge router  |
| [Helm](https://helm.sh/) |  2 | Package manager for Kubernetes |

For more details, see the [Konvoy documentation](https://docs.d2iq.com/ksphere/konvoy/).





* Install Tiller.
* Install the [Dispatch CLI](../install/cli/).
* Set up [credentials](../credentials/).
<!-- * Install Helm v2 (see the section on Installing Helm) -->

# Installing Dispatch into a D2iQ Konvoy Cluster

The easiest way to install Dispatch is on Konvoy.

1. In your `cluster.yaml`, set the Dispatch addon field `enabled` to `true`:

    ```yaml
    apiVersion: konvoy.mesosphere.io/v1beta1
    kind: ClusterConfiguration
    spec:
      addons:
      - addonsList:
        - enabled: true
          name: dispatch
    ```

1. Install Dispatch into the cluster.

    ```bash
    konvoy up
    ```

2. Verify that the Dispatch components are set up correctly.

    ```bash
    helm test dispatch-kubeaddons
    ```

# Installing Dispatch into a non-Konvoy Cluster

To install Dispatch, be sure that you have a cluster with Tiller installed. If you are using a Konvoy cluster, you are already set.

## Install Tiller


  ```bash
  kubectl create serviceaccount -n kube-system tiller
  kubectl create clusterrolebinding tiller --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
  helm init --wait --service-account tiller
  ```

## Installing Dispatch into a Cluster via Dispatch CLI

To install Dispatch into a Kubernetes cluster:

1.  Execute the command `dispatch init`, which will use Helm to perform the installation in a release called "dispatch":

    ```bash
    dispatch init
    ```

<p class=message--note"><strong>NOTE: </strong>Dispatch uses Helm v2. Helm v3 has not been tested with Dispatch.</p>

1. Set `--namespace` to install Dispatch into a namespace other than `dispatch`.
1. If you want to restrict the namespaces that Dispatch has access to, set the `--watch-namespace` flag for each namespace Dispatch should have access to.
1. Run `helm test dispatch` to verify that the Dispatch components are set up correctly.

This will take several minutes, but your Dispatch cluster will be fully ready for use once it is completed.


## Installing Dispatch into a Cluster via Helm

Dispatch can be installed using Helm directly. Dispatch uses Helm v2.

1. Add the Dispatch Helm repository:

    ```bash
    helm repo add dispatch https://mesosphere.github.io/dispatch
    helm repo update
    ```

2. Install via Helm:

    ```bash
    helm install --name dispatch --namespace dispatch dispatch/dispatch
    ```

3. Run `helm test dispatch` to verify that the Dispatch components are set up correctly.

# Scaling

## ArgoCD

By default, the following ArgoCD components have autoscaling enabled using a Horizontal Pod Autoscaler (HPA):

- `argocd-server`: The ArgoCD UI / API server.
- `argocd-repo-server`: The ArgoCD repository server that manages local mirrors of your GitOps applications' source repositories.

Other ArgoCD components do not currently support running multiple pods.

The following options are available for configuring the autoscaling behaviour of ArgoCD's `server` and `repo-server` components:

| Key | Description | Default |
|-----|------|---------|
| argo-cd.server.autoscaling.enabled | Enable Horizontal Pod Autoscaler (HPA) for the server | `true` |
| argo-cd.server.autoscaling.minReplicas | Minimum number of replicas for the server HPA | `1` |
| argo-cd.server.autoscaling.maxReplicas | Maximum number of replicas for the server HPA | `5` |
| argo-cd.server.autoscaling.targetCPUUtilizationPercentage | Average CPU utilization percentage for the server HPA | `75` |
| argo-cd.server.autoscaling.targetMemoryUtilizationPercentage | Average memory utilization percentage for the server HPA | `75` |
| argo-cd.repoServer.autoscaling.enabled | Enable Horizontal Pod Autoscaler (HPA) for the server | `true` |
| argo-cd.repoServer.autoscaling.minReplicas | Minimum number of replicas for the server HPA | `1` |
| argo-cd.repoServer.autoscaling.maxReplicas | Maximum number of replicas for the server HPA | `5` |
| argo-cd.repoServer.autoscaling.targetCPUUtilizationPercentage | Average CPU utilization percentage for the server HPA | `75` |
| argo-cd.repoServer.autoscaling.targetMemoryUtilizationPercentage | Average memory utilization percentage for the server HPA | `75` |

The default autoscaling values can be overridden at install time as follows:

If you are installing Dispatch using the CLI, you can set these values as follows:

```bash
dispatch init --set argo-cd.server.autoscaling.minReplicas=2 \
  --set argo-cd.repoServer.autoscaling.minReplicas=3
```

If you are installing Dispatch using helm, you can set these values as follows:

```bash
helm install --name dispatch --namespace dispatch dispatch/dispatch \
  --set argo-cd.server.autoscaling.minReplicas=2 \
  --set argo-cd.repoServer.autoscaling.minReplicas=3 \
```

If you are installing Dispatch as a Konvoy addon, you can set the `values` property:

```yaml
    apiVersion: konvoy.mesosphere.io/v1beta1
    kind: ClusterConfiguration
    spec:
      addons:
      - addonsList:
        - enabled: true
          name: dispatch
          values: |
          ---
          argo-cd:
            server:
              autoscaling:
                minReplicas: 2
                maxReplicas: 4
            repoServer:
              autoscaling:
                minReplicas: 3
                maxReplicas: 5
```

If you want to specify the number of replicas for these services manually, you
can do so by disabling autoscaling and setting the number of replicas explicitly:

```bash
dispatch init \
  --set argo-cd.server.autoscaling.enabled=false \
  --set argo-cd.repoServer.autoscaling.enabled=false \
  --set argo-cd.server.replicas=2 \
  --set argo-cd.repoServer.replicas=1
```

Or, if you are installing Dispatch as a Konvoy addon:

```yaml
    apiVersion: konvoy.mesosphere.io/v1beta1
    kind: ClusterConfiguration
    spec:
      addons:
      - addonsList:
        - enabled: true
          name: dispatch
          values: |
          ---
          argo-cd:
            server:
              autoscaling:
                enabled: false
              replicas: 1
            repoServer:
              autoscaling:
                enabled: false
              replicas: 1
```

# Next steps

At this point, you've successfully installed Dispatch. Next,
you will add a new application to Dispatch CI. To do so, follow the steps
at [Setting up a repository to use Dispatch](../repo-setup/).

# Install Dispatch into Multiple Clusters
