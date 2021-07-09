---
layout: layout.pug
navigationTitle: Service Federation
title: Federation of Services
menuWeight: 30
beta: true
excerpt: How to federate services on to attached clusters
---
<!-- markdownlint-disable MD004 MD040 -->

This topic describes how to federate a service to an attached cluster.
<p class="message--note"><strong>NOTE: </strong>Single-Sign-On stack is not currently supported, so some of these services may not be fully functional.</p>

Currently, the `reloader` service is automatically federated to attached clusters. To federate other services, follow the steps below.

## Before you begin

You need certain software configurations and settings before you start this procedure. This procedure requires the following items and configurations:

- A running cluster with Kommander installed
- An unattached Kubernetes cluster

## Attach a cluster

Run the following commands on the Kommander cluster to create a workspace and attach a cluster into it.

<p class="message--important"><strong>IMPORTANT: </strong>The Default Workspace is currently reserved for the host management cluster. All other clusters must be attached to a different workspace.</p>

1. Create a new workspace:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: Workspace
metadata:
  name: workspace-test
EOF
```

After the workspace is successfully created, it appears in the list:

```bash
kubectl get workspaces
NAME                DISPLAY NAME        WORKSPACE NAMESPACE           AGE
default-workspace   Default Workspace   kommander-default-workspace   62m
workspace-test                          workspace-test-vjsfq          12m
```

<p class="message--note"><strong>NOTE: </strong>Use the newly created workspace namespace and adjust the following commands accordingly. The actual namespace shown is a generated component, so it is different than the listed commands.</p>

1. Create a secret containing the kubeconfig for the cluster you want to attach:

```bash
kubectl create -n workspace-test-vjsfq secret generic kommander-spoke-1-kubeconfig --from-file=kubeconfig
```

1. Create the `KommanderCluster` resource. This attaches the cluster and makes it visible in Kommander.

<p class="message--note"><strong>NOTE: </strong>Creating the resource inside the workspace namespace ensures the cluster is part of the workspace.</p>

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: kommander.mesosphere.io/v1beta1
kind: KommanderCluster
metadata:
  name: kommander-spoke-1
  namespace: workspace-test-vjsfq
spec:
  kubeconfigRef:
    name: kommander-spoke-1-kubeconfig
EOF
```

The cluster achieves `Joined` status:

```bash
kubectl get kommandercluster -A
NAMESPACE                     NAME                DISPLAY NAME   STATUS   KUBEFED CLUSTER     AGE
kommander-default-workspace   host-cluster                       Joined   host-cluster        66m
workspace-test-vjsfq          kommander-spoke-1                  Joined   kommander-spoke-1   6m29s
```

Additionally, the cluster must appear in the list of kubefed-clusters:

```bash
kubectl get kubefedclusters -A
NAMESPACE   NAME                AGE     READY
kommander   host-cluster        66m     True
kommander   kommander-spoke-1   2m47s   True
```

## Deploy a service

The list of available platform services that can be federated on the attached cluster are:

```
NAME                           APP ID
cert-manager-0.2.7             cert-manager
external-dns-2.20.5            external-dns
gatekeeper-0.6.8               gatekeeper
grafana-logging-6.9.1          grafana-logging
istio-1.9.1                    istio
jaeger-2.21.0                  jaeger
kiali-1.29.0                   kiali
kommander-current              kommander
kube-oidc-proxy-0.2.5          kube-oidc-proxy
kube-prometheus-stack-15.4.6   kube-prometheus-stack
kubecost-0.13.0                kubecost
kubefed-0.8.1                  kubefed
kubernetes-dashboard-4.0.3     kubernetes-dashboard
logging-operator-3.10.0        logging-operator
loki-distributed-0.33.1        loki-distributed
metallb-0.12.2                 metallb
nvidia-0.4.0                   nvidia
prometheus-adapter-2.11.1      prometheus-adapter
reloader-0.0.85                reloader
traefik-9.19.1                 traefik
traefik-forward-auth-0.2.14    traefik-forward-auth
velero-3.1.1                   velero
```

**Note:**  `dex`, `kubefed`, `kommander` and `dex-k8s-authenticator` are excluded from the list because they cannot be federated on the attached clusters.

With the cluster now attached, deploy one of the defined services with an `AppDeployment` resource. The `AppDeployment` has an `appRef` that specifies which `App` is federated.

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: apps.kommander.d2iq.io/v1alpha1
kind: AppDeployment
metadata:
  name: cert-manager-0.2.7
  namespace: workspace-test-vjsfq
spec:
  appRef:
    name: cert-manager-0.2.7
EOF
```

To instruct Kommander to federate the `AppDeployment` to the `KommanderCluster`s in the same workspace, create the resource in the workspace you just created.
The `appRef.name` must match the app `name` from the list of available services.

## Deploy a service with a custom configuration

Locate the default service configuration in a `ConfigMap`:

```bash
kubectl get configmap -n workspace-test-vjsfq metallb-d2iq-defaults -oyaml
```

To provide custom configuration on top of the default configuration, provide the name of a `ConfigMap` in the `AppDeployment`:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: apps.kommander.d2iq.io/v1alpha1
kind: AppDeployment
metadata:
  name: metallb-0.12.2
  namespace: workspace-test-vjsfq
spec:
  appRef:
    name: metallb-0.12.2
  configOverrides:
    name: metallb-overrides-attached
EOF
```

The `AppDeployment` waits for the `ConfigMap` named `metallb-overrides-attached` to be present before federating it to the attached clusters:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: workspace-test-vjsfq
  name: metallb-overrides-attached
data:
  values.yaml: |
    configInLine:
       address-pools:
        - name: default
           protocol: layer2
           addresses:
           - 172.17.255.150-172.17.255.199
EOF
```

## Verify services

These services are now federated. Connect to the attached cluster and check the `HelmReleases` to verify the deployment:

```bash
kubectl get helmreleases -n workspace-test-vjsfq
NAMESPACE               NAME        READY   STATUS                             AGE
workspace-test-vjsfq    metallb     True    Release reconciliation succeeded   7m3s
```

Note that some of these services have dependencies between themselves. See this list for the services dependencies:

* `istio` **depends on** `kube-prometheus-stack`.
* `kiali` **depends on** `istio` and `kube-prometheus-stack`.
* `kube-oidc-proxy` **depends on** `dex`.
* `kube-prometheus-stack` **depends on** `traefik`.
* `kubecost` **depends on** `traefik` and `traefik-foward-auth`.
* `traefik-foward-auth` **depends on** `traefik`.
* `prometheus-adapter` **depends on** `kube-prometheus-stack`.
