---
layout: layout.pug
navigationTitle: Install
title: Install
menuWeight: 3
excerpt: Getting started with Kommander
beta: true
---

## Prerequisites

Prior to installing Kommander, you must know the version you'd like to install, which is provided by D2iQ.

Kommander 2 ships in a Helm chart, so prior to installing Kommander, make Helm aware of the Helm repository providing the Kommander chart:

```sh
helm repo add kommander https://mesosphere.github.io/kommander/charts
helm repo up
```

To ensure the Git repository shipped with Kommander deploys successfully, the cluster you install Kommander on must have a default `StorageClass` configured. Run the following command:

```sh
kubectl get sc
```

The output should look similar to this. Note the `(default)` after the name:

```sh
NAME               PROVISIONER       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
ebs-sc (default)   ebs.csi.aws.com   Delete          WaitForFirstConsumer   false                  41s
```

<!--
## Install on kind

If you are installing Kommander on kind, you must know the following:

- The Docker network that kind is using to configuring the MetalLB load balancer. Run this command to find this information:

    ```sh
    docker network inspect kind -f '{{with index .IPAM.Config 0}}{{.Subnet}}{{end}}'
    ```

    The subnet is usually `172.18.0.0/16`. Type your subnet into the the following command to install Kommander:

    ```sh
    helm install -n kommander --create-namespace kommander-bootstrap kommander/kommander-bootstrap --devel --version=<VERSION> --set services.metallb.enabled=true,services.metallb.addresses=172.18.255.200-172.18.255.250,services.metallb.existingConfigMap=metallb-dev-config
    ```
-->

## Install on Konvoy 2

There are two different scenarios for installing Kommander on Konvoy:

1. Installation on a self-managing cluster (see [the Konvoy documentation for further details][konvoy_self_managing])
2. Installation on a cluster managed by a different bootstrap cluster

In the first scenario you install Kommander like this:

```sh
helm install -n kommander --create-namespace kommander-bootstrap kommander/kommander-bootstrap --devel --version=<VERSION> --set certManager=false
```

In the second scenario you install Kommander like this:

```sh
helm install -n kommander --create-namespace kommander-bootstrap kommander/kommander-bootstrap --devel --version=<VERSION>
```

## Verify installation

After Helm successfully installs the chart, you must wait for all `HelmReleases` to deploy. The Kommander installation is a two-step process: Flux and cert-manager install first, then the Git repository spins up and permits Flux to consume further `HelmReleases` from that repository.

After running `helm install`, the cert-manager `HelmRelease` is ready and, after additional time,  `HelmReleases` appear on the cluster.

```sh
kubectl get helmreleases -A
```

The final output must look similar to this example:

```sh
NAMESPACE   NAME                    READY   STATUS                             AGE
kommander   cert-manager            True    Release reconciliation succeeded   9m41s
kommander   dex                     True    Release reconciliation succeeded   7m3s
kommander   dex-k8s-authenticator   True    Release reconciliation succeeded   7m3s
kommander   kommander               True    Release reconciliation succeeded   7m3s
kommander   kommander-ui            True    Release reconciliation succeeded   7m3s
kommander   kube-oidc-proxy         True    Release reconciliation succeeded   7m3s
kommander   kube-prometheus-stack   True    Release reconciliation succeeded   7m3s
kommander   kubecost                True    Release reconciliation succeeded   7m3s
kommander   kubefed                 True    Release reconciliation succeeded   7m3s
kommander   kubernetes-dashboard    True    Release reconciliation succeeded   7m3s
kommander   metallb                 True    Release reconciliation succeeded   7m3s
kommander   prometheus-adapter      True    Release reconciliation succeeded   7m3s
kommander   reloader                True    Release reconciliation succeeded   7m3s
kommander   traefik                 True    Release reconciliation succeeded   7m3s
kommander   traefik-forward-auth    True    Release reconciliation succeeded   7m3s
```

## Access Kommander Web UI

When all the `HelmReleases` are ready, use the following command to retrieve the URL for accessing Kommander's Web interface:

```sh
kubectl -n kommander get svc kommander-traefik -o go-template='https://{{with index .status.loadBalancer.ingress 0}}{{or .hostname .ip}}{{end}}/dkp/kommander/dashboard{{ "\n"}}'
```

Use the following command to access the Username and Password stored on the cluster:

```sh
kubectl -n kommander get secret dkp-credentials -o go-template='Username: {{.data.username|base64decode}}{{ "\n"}}Password: {{.data.password|base64decode}}{{ "\n"}}'
```

[konvoy_self_managing]: ../../../konvoy/2.0/install/advanced/self-managing/
