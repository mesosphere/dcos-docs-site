---
layout: layout.pug
navigationTitle: Application Deployment
title: Deployment of Applications
menuWeight: 30
beta: true
excerpt: How to deploy applications to attached clusters
---
<!-- markdownlint-disable MD004 MD040 -->

This topic describes how to deploy an application to attached clusters within a workspace.

Currently, the `cert-manager`, `kube-prometheus-stack`, `kubecost`, `kubernetes-dashboard`, `prometheus-adapter`, `traefik`, `traefik-forward-auth`, and `reloader` applications are automatically deployed to attached clusters.

You can use the UI to deploy applications.
To deploy applications using the CLI, follow the steps below.

## Prerequisites

Before you begin, you must have:

- A running cluster with [Kommander installed](../../install/).
- An [existing Kubernetes cluster attached to Kommander](../../clusters/attach-cluster/).

Set the `WORKSPACE_NAMESPACE` environment variable to the name of the workspace's namespace where the cluster is attached:

```sh
export WORKSPACE_NAMESPACE=<workspace_namespace>
```

## Deploy the application

The list of available applications that can be deployed on the attached cluster are:

```
NAME                           APP ID
cert-manager-0.2.7             cert-manager
external-dns-2.20.5            external-dns
gatekeeper-0.6.8               gatekeeper
grafana-logging-6.13.9         grafana-logging
istio-1.9.1                    istio
jaeger-2.21.0                  jaeger
kiali-1.29.0                   kiali
kube-oidc-proxy-0.2.5          kube-oidc-proxy
kube-prometheus-stack-16.13.1  kube-prometheus-stack
kubecost-0.15.0                kubecost
kubernetes-dashboard-4.0.3     kubernetes-dashboard
logging-operator-3.13.0        logging-operator
loki-distributed-0.33.1        loki-distributed
metallb-0.12.2                 metallb
nvidia-0.4.0                   nvidia
prometheus-adapter-2.11.1      prometheus-adapter
reloader-0.0.85                reloader
traefik-9.19.1                 traefik
traefik-forward-auth-0.2.14    traefik-forward-auth
velero-3.1.1                   velero
```

<p class="message--note"><strong>NOTE: </strong>Currently, Kommander only supports a single deployment of <code>cert-manager</code> per cluster. Because of this, <code>cert-manager</code> cannot be installed on <code>Konvoy</code> managed <code>AWS</code> clusters.</p>

<p class="message--note"><strong>NOTE: </strong>Only a single deployment of <code>traefik</code> per cluster is supported.</p>

1.  Deploy one of the supported applications to [your existing attached cluster](../../clusters/attach-cluster/) with an `AppDeployment` resource.

1.  Within the `AppDeployment`, define the `appRef` to specify which `App` will be deployed:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha1
    kind: AppDeployment
    metadata:
      name: cert-manager-0.2.7
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        name: cert-manager-0.2.7
    EOF
    ```

1.  Create the resource in the workspace you just created, which instructs Kommander to deploy the `AppDeployment` to the `KommanderCluster`s in the same workspace.

<p class="message--note"><strong>NOTE: </strong>The <code>appRef.name</code> must match the app <code>name</code> from the list of available applications.</p>

## Deploy an application with a custom configuration

1.  Locate and view the default application configuration in the `ConfigMap`:

    ```bash
    kubectl get configmap -n ${WORKSPACE_NAMESPACE} metallb-d2iq-defaults -oyaml
    ```

1.  Provide the name of a `ConfigMap` in the `AppDeployment`, which provides custom configuration on top of the default configuration:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha1
    kind: AppDeployment
    metadata:
      name: metallb-0.12.2
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        name: metallb-0.12.2
      configOverrides:
        name: metallb-overrides-attached
    EOF
    ```

1.  Create the `ConfigMap` with the name provided in the step above, with the custom configuration:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ConfigMap
    metadata:
      namespace: ${WORKSPACE_NAMESPACE}
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

Kommander waits for the `ConfigMap` to be present before deploying the `AppDeployment` to the attached clusters.

## Verify applications

The applications are now deployed. Connect to the attached cluster and check the `HelmReleases` to verify the deployment:

```bash
kubectl get helmreleases -n ${WORKSPACE_NAMESPACE}
NAMESPACE               NAME        READY   STATUS                             AGE
workspace-test-vjsfq    metallb     True    Release reconciliation succeeded   7m3s
```

<p class="message--note"><strong>NOTE: </strong>Some of the supported applications have dependencies on other applications. See <a href="../workspace-platform-services/platform-service-dependencies/">Workspace Platform Application Dependencies</a> for that table.</p>
