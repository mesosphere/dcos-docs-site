---
layout: layout.pug
navigationTitle: Install Kommander networked
title: Install Kommander in a networked environment
menuWeight: 20
excerpt: Install Kommander in a networked environment
beta: false
---

## Prerequisites

Before you begin using Kommander, you must:

- Configure a Konvoy cluster using the [Konvoy Install](/dkp/konvoy/2.1/choose-infrastructure/) instructions.
- Install `cert-manager` prior to installing Kommander. (Konvoy does this as part of its install process).
- Install Kommander before executing any `kommander` commands. Ensure you have the version of the CLI that matches the Kommander version you want to install.

### Default StorageClass

To ensure the Git repository that Kommander ships with deploys successfully, the cluster where Kommander is installed must have a default `StorageClass` configured. Run the following command:

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

More information on setting a StorageClass as default can be found at [Changing the default storage class in k8s docs][k8s-change-default-storage-class].

## Install Kommander on Konvoy

Before running the commands below, ensure that your `kubectl` configuration references the cluster on which you want to install Kommander. You can do this by setting the `KUBECONFIG` environment variable to the appropriate kubeconfig file's location.

<p class="message--note"><strong>NOTE:</strong> See the <a href="../configuration">configuration</a> page for more details on how to customize a Kommander installation.</p>

```sh
kommander install
```

## Verify installation

After the CLI successfully installs the components, you must wait for all `HelmReleases` to deploy.

The Kommander installation is a multi-step process: Flux installs first, then the Git repository spins up permitting Flux to consume further `HelmReleases` from that repository.

After running the install command, `HelmReleases` begin to appear on the cluster.

```sh
kubectl -n kommander wait --for condition=Released helmreleases --all --timeout 15m
```

This will wait for each of the helm charts to reach their `Released` condition, eventually resulting in something resembling this:

```text
helmrelease.helm.toolkit.fluxcd.io/centralized-grafana condition met
helmrelease.helm.toolkit.fluxcd.io/dex condition met
helmrelease.helm.toolkit.fluxcd.io/dex-k8s-authenticator condition met
helmrelease.helm.toolkit.fluxcd.io/fluent-bit condition met
helmrelease.helm.toolkit.fluxcd.io/gitea condition met
helmrelease.helm.toolkit.fluxcd.io/grafana-logging condition met
helmrelease.helm.toolkit.fluxcd.io/grafana-loki condition met
helmrelease.helm.toolkit.fluxcd.io/karma condition met
helmrelease.helm.toolkit.fluxcd.io/kommander condition met
helmrelease.helm.toolkit.fluxcd.io/kommander-appmanagement condition met
helmrelease.helm.toolkit.fluxcd.io/kube-prometheus-stack condition met
helmrelease.helm.toolkit.fluxcd.io/kubecost condition met
helmrelease.helm.toolkit.fluxcd.io/kubecost-thanos-traefik condition met
helmrelease.helm.toolkit.fluxcd.io/kubefed condition met
helmrelease.helm.toolkit.fluxcd.io/kubernetes-dashboard condition met
helmrelease.helm.toolkit.fluxcd.io/kubetunnel condition met
helmrelease.helm.toolkit.fluxcd.io/logging-operator condition met
helmrelease.helm.toolkit.fluxcd.io/logging-operator-logging condition met
helmrelease.helm.toolkit.fluxcd.io/minio-operator condition met
helmrelease.helm.toolkit.fluxcd.io/prometheus-adapter condition met
helmrelease.helm.toolkit.fluxcd.io/prometheus-thanos-traefik condition met
helmrelease.helm.toolkit.fluxcd.io/reloader condition met
helmrelease.helm.toolkit.fluxcd.io/thanos condition met
helmrelease.helm.toolkit.fluxcd.io/traefik condition met
helmrelease.helm.toolkit.fluxcd.io/traefik-forward-auth-mgmt condition met
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

[enable-gatekeeper]: ../http-proxy#enable-gatekeeper
[k8s-change-default-storage-class]: https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/

[download]: ../../download
