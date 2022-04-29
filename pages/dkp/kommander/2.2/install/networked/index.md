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
- Review the [Management cluster application requirements](../mgmt-cluster-apps) and [Workspace platform application requirements](../../workspaces/applications/platform-applications/platform-application-requirements) to ensure that your cluster has sufficient resources.
- Install Kommander before executing any `kommander` commands. Ensure you have the version of the CLI that matches the Kommander version you want to install.

### Default StorageClass

To ensure the Git repository that Kommander ships with deploys successfully, the cluster where Kommander is installed must have a default `StorageClass` configured. Run the following command:

```bash
kubectl get sc
```

The output should look similar to this. Note the `(default)` after the name:

```sh
NAME               PROVISIONER       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
ebs-sc (default)   ebs.csi.aws.com   Delete          WaitForFirstConsumer   false                  41s
```

If the `StorageClass` is not set as default, add the following annotation to the `StorageClass` manifest:

```yaml
annotations:
  storageclass.kubernetes.io/is-default-class: "true"
```

More information on setting a StorageClass as default can be found at [Changing the default storage class in k8s docs][k8s-change-default-storage-class].

## Install Kommander on Konvoy

To customize a Kommander installation, see the [configuration page][configuration-kommander] for more details.

Before running the commands below, ensure that your `kubectl` configuration **references the cluster on which you want to install Kommander**, otherwise it will install on the bootstrap cluster. You can do this by setting the `KUBECONFIG` environment variable [to the appropriate kubeconfig file's location][k8s-access-to-clusters].

<p class="message--note"><strong>NOTE:</strong> An alternative to initializing the KUBECONFIG environment variable as stated earlier is to use the <code>--kubeconfig=cluster_name.conf</code> flag. This ensures that Kommander is installed on the workload cluster.</p>

```bash
dkp install kommander
```

## Verify installation

After the CLI successfully installs the components, you must wait for all `HelmReleases` to deploy.

The Kommander installation is a multi-step process: Flux installs first, then the Git repository spins up permitting Flux to consume further `HelmReleases` from that repository.

After running the install command, `HelmReleases` begin to appear on the cluster.

```bash
kubectl -n kommander wait --for condition=Released helmreleases --all --timeout 15m
```

This will wait for each of the helm charts to reach their `Released` condition, eventually resulting in something resembling this:

```sh
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

You can check the status of a `HelmRelease` with:

```bash
kubectl -n kommander get helmrelease <HELMRELEASE_NAME>
```

If you find any `HelmReleases` in a "broken" release state such as "exhausted" or "another rollback/release in progress", you can trigger a reconciliation of the `HelmRelease` using the following commands:

```bash
kubectl -n kommander patch helmrelease <HELMRELEASE_NAME> --type='json' -p='[{"op": "replace", "path": "/spec/suspend", "value": true}]'
kubectl -n kommander patch helmrelease <HELMRELEASE_NAME> --type='json' -p='[{"op": "replace", "path": "/spec/suspend", "value": false}]'
```

## Access DKP UI

When all the `HelmReleases` are ready, use the following command to open the DKP UI in your browser:

```bash
dkp open dashboard
```

This command opens the URL of the Kommander web interface in your default browser, and prints the username and password in the CLI.

If you prefer not to open your browser, or are running the DKP CLI from a host that does not have a browser installed, run this command to retrieve the URL used for accessing the DKP UI:

```bash
kubectl -n kommander get svc kommander-traefik -o go-template='https://{{with index .status.loadBalancer.ingress 0}}{{or .hostname .ip}}{{end}}/dkp/kommander/dashboard{{ "\n"}}'
```

And, use the following command to access the username and password stored on the cluster:

```bash
kubectl -n kommander get secret dkp-credentials -o go-template='Username: {{.data.username|base64decode}}{{ "\n"}}Password: {{.data.password|base64decode}}{{ "\n"}}'
```

[k8s-change-default-storage-class]: https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class
[k8s-access-to-clusters]: https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[configuration-kommander]: ../configuration/
