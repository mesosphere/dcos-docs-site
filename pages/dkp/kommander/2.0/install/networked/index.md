---
layout: layout.pug
navigationTitle: Install Kommander networked
title: Install Kommander in a networked environment
menuWeight: 10
excerpt: Install Kommander in a networked environment
beta: true
---

## Prerequisites

Prior to installing Kommander, you must know the version you'd like to install, which is provided by D2iQ.

Set the `VERSION` environment variable to the version of Kommander you would like to install, for example:

```sh
export VERSION=v2.0.0-beta.5
```

Kommander ships in a Helm chart, so prior to installing Kommander, make Helm aware of the Helm repository providing the Kommander chart:

```sh
helm repo add kommander https://mesosphere.github.io/kommander/charts
helm repo up
```

### Default StorageClass

To ensure the Git repository shipped with Kommander deploys successfully, the cluster you install Kommander on must have a default `StorageClass` configured. Run the following command:

```sh
kubectl get sc
```

The output should look similar to this. Note the `(default)` after the name:

```sh
NAME               PROVISIONER       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
ebs-sc (default)   ebs.csi.aws.com   Delete          WaitForFirstConsumer   false                  41s
```

If the `StorageClass` is not set as default, add the following annotation to the `StorageClass` manifest:

```sh
annotations:
  storageclass.kubernetes.io/is-default-class: "true"
```

More information on the step can be found [here][konvoy_driver_limitations].

<!--
## Install on kind

If you are installing Kommander on kind, you must know the following:

- The Docker network that kind is using to configuring the MetalLB load balancer. Run this command to find this information:

    ```sh
    docker network inspect kind -f '{{with index .IPAM.Config 0}}{{.Subnet}}{{end}}'
    ```

    The subnet is usually `172.18.0.0/16`. Type your subnet into the the following command to install Kommander:

    ```sh
    helm install -n kommander --create-namespace kommander-bootstrap kommander/kommander-bootstrap --devel --version=${VERSION} --set services.metallb.enabled=true,services.metallb.addresses=172.18.255.200-172.18.255.250,services.metallb.existingConfigMap=metallb-dev-config
    ```
-->

## Install on Konvoy

There are two different scenarios for installing networked Kommander on Konvoy:

1. Install on a [self-managing cluster][konvoy_self_managing].
2. Install on a cluster managed by a [different bootstrap cluster][bootstrap_cluster].

To install Kommander with http proxy setting enabled, you need to create the `kommander` namespace manually with the right set of labels and create `gatekeeper-overrides` configmap as outlined in the [enable gatekeeper](../http-proxy#enable-gatekeeper) section before proceeding further.

To enable a gatekeeper proxy, you must pass the `values.yaml` you created to the following commands using `--values=values.yaml`.

To install Kommander on a self-managing cluster:

```sh
helm install -n kommander --create-namespace kommander-bootstrap kommander/kommander-bootstrap --devel --version=${VERSION} --set certManager=false
```

To install Kommander on a cluster managed by a different bootstrap cluster:

```sh
helm install -n kommander --create-namespace kommander-bootstrap kommander/kommander-bootstrap --devel --version=${VERSION}
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
kommander   dex                        True    Release reconciliation succeeded   8m25s
kommander   dex-k8s-authenticator      True    Release reconciliation succeeded   8m25s
kommander   kommander                  True    Release reconciliation succeeded   8m25s
kommander   kube-oidc-proxy            True    Release reconciliation succeeded   8m25s
kommander   kube-prometheus-stack      True    Release reconciliation succeeded   8m25s
kommander   kubecost                   True    Release reconciliation succeeded   8m25s
kommander   kubefed                    True    Release reconciliation succeeded   8m25s
kommander   kubernetes-dashboard       True    Release reconciliation succeeded   8m25s
kommander   prometheus-adapter         True    Release reconciliation succeeded   8m25s
kommander   reloader                   True    Release reconciliation succeeded   8m25s
kommander   traefik                    True    Release reconciliation succeeded   8m25s
kommander   traefik-forward-auth       True    Release reconciliation succeeded   8m25s
kommander   velero                     True    Release reconciliation succeeded   8m25s
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

[konvoy_driver_limitations]: /dkp/konvoy/2.0/install/advanced/configure_drivers/#known-limitations
[konvoy_self_managing]: /dkp/konvoy/2.0/install/advanced/self-managing/
[bootstrap_cluster]: /dkp/konvoy/2.0/install/advanced/bootstrap/
