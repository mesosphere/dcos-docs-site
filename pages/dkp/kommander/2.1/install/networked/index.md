---
layout: layout.pug
navigationTitle: Install Kommander networked
title: Install Kommander in a networked environment
menuWeight: 10
excerpt: Install Kommander in a networked environment
beta: false
---

## Prerequisites

Prior to installing Kommander, you must know the version you'd like to install, which is provided by D2iQ.

Set the `VERSION` environment variable to the version of Kommander you would like to install, for example:

```sh
export VERSION=v2.0.0
```

Kommander ships in a Helm chart, so prior to installing Kommander, make Helm aware of the Helm repository providing the Kommander chart:

```sh
helm repo add kommander https://mesosphere.github.io/kommander/charts
helm repo update
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

More information on setting a StorageClass as default can be found at [Changing the default storage class in k8s docs](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)

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

Before running the commands below make sure that your `kubectl` configuration is pointing to the cluster you want to install Kommander on by setting the `KUBECONFIG` environment variable to the respective kubeconfig file's location.

To install Kommander with http proxy setting enabled, you need to follow the instructions outlined in [enable gatekeeper](../http-proxy#enable-gatekeeper) section before proceeding further. To enable a gatekeeper proxy, you must pass the `values.yaml` you created to the following commands using `--values=values.yaml`

```sh
helm install -n kommander --create-namespace kommander-bootstrap kommander/kommander-bootstrap --version=${VERSION} --set certManager=$(kubectl get ns cert-manager > /dev/null 2>&1 && echo "false" || echo "true")
```

## Verify installation

After Helm successfully installs the chart, you must wait for all `HelmReleases` to deploy.

The Kommander installation is a two-step process: Flux and cert-manager install first, then the Git repository spins up and permits Flux to consume further `HelmReleases` from that repository.

After running `helm install`, the cert-manager `HelmRelease` is ready and, after additional time,  `HelmReleases` appear on the cluster.

```sh
kubectl -n kommander wait --for condition=Released helmreleases --all --timeout 15m
```

This will wait for each of the helm charts to reach their `Released` condition, eventually resulting in:

```text
helmrelease.helm.toolkit.fluxcd.io/centralized-grafana condition met
helmrelease.helm.toolkit.fluxcd.io/dex condition met
helmrelease.helm.toolkit.fluxcd.io/dex-k8s-authenticator condition met
helmrelease.helm.toolkit.fluxcd.io/fluent-bit condition met
helmrelease.helm.toolkit.fluxcd.io/grafana-logging condition met
helmrelease.helm.toolkit.fluxcd.io/grafana-loki condition met
helmrelease.helm.toolkit.fluxcd.io/karma condition met
helmrelease.helm.toolkit.fluxcd.io/kommander condition met
helmrelease.helm.toolkit.fluxcd.io/kube-oidc-proxy condition met
helmrelease.helm.toolkit.fluxcd.io/kube-prometheus-stack condition met
helmrelease.helm.toolkit.fluxcd.io/kubecost condition met
helmrelease.helm.toolkit.fluxcd.io/kubefed condition met
helmrelease.helm.toolkit.fluxcd.io/kubernetes-dashboard condition met
helmrelease.helm.toolkit.fluxcd.io/kubetunnel condition met
helmrelease.helm.toolkit.fluxcd.io/logging-operator condition met
helmrelease.helm.toolkit.fluxcd.io/logging-operator-logging condition met
helmrelease.helm.toolkit.fluxcd.io/minio-operator condition met
helmrelease.helm.toolkit.fluxcd.io/prometheus-adapter condition met
helmrelease.helm.toolkit.fluxcd.io/reloader condition met
helmrelease.helm.toolkit.fluxcd.io/thanos condition met
helmrelease.helm.toolkit.fluxcd.io/traefik condition met
helmrelease.helm.toolkit.fluxcd.io/traefik-forward-auth condition met
helmrelease.helm.toolkit.fluxcd.io/velero condition met
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

[konvoy_self_managing]: /dkp/konvoy/2.0/install/advanced/self-managing/
[bootstrap_cluster]: /dkp/konvoy/2.0/install/advanced/bootstrap/
