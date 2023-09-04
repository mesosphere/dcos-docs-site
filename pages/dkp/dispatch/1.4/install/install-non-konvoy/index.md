---
layout: layout.pug
navigationTitle: Install on non-Konvoy Kubernetes
title: Install on non-Konvoy Kubernetes
menuWeight: 30
beta: false
excerpt: Install and Configure Dispatch on non-Konvoy Kubernetes clusters.
---
# Installing Dispatch into a non-Konvoy Cluster

# Prerequisites

Before you install Dispatch, be sure you have completed the [Prerequisites](../prerequisites/).

* Configure kubectl to point to the correct Kubernetes cluster.
* Install the [Dispatch CLI](../cli/).
* Set up [credentials](../../tutorials/ci_tutorials/credentials/).
* Install Helm v3.

## Install Dispatch into a Cluster via Dispatch CLI

To install Dispatch with the default configuration, run:

```
dispatch init
```

It is possible to customize the install location with the `--namespace` flag. By default, the Dispatch instance will watch all namespaces for Dispatch repository configurations. However, if you specify the `--watch-namespace` flag it is possible to customize which namespaces Dispatch can see:

```
dispatch init --watch-namespace dispatch-tasks --watch-namespace dispatch-work
```

### Configure Ingress

By default, Dispatch creates Ingress records under the `/dispatch/` path. However, you may want to configure this if: there are multiple Dispatch instances, you want to specify a hostname, use a different Ingress controller or otherwise customize the Dispatch Ingress.

The default Helm values for Ingress are:

```yaml
ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: traefik
    traefik.ingress.kubernetes.io/rule-type: PathPrefixStrip
  hosts:
    - paths: [/dispatch/hook]
      host: ""
tekton-dashboard:
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.class: traefik
      traefik.ingress.kubernetes.io/auth-response-headers: "X-Forwarded-User"
      traefik.ingress.kubernetes.io/auth-type: "forward"
      traefik.ingress.kubernetes.io/auth-url: "http://traefik-forward-auth-kubeaddons.kubeaddons.svc.cluster.local:4181/"
      traefik.ingress.kubernetes.io/rule-type: PathPrefixStrip
      traefik.ingress.kubernetes.io/priority: "1"
    hosts:
      - paths: [/dispatch/tekton]
        host: ""
kommander-ui:
  ingress:
    enabled: true
    traefikFrontendRuleType: PathPrefixStrip
    path: /dispatch/dashboard
    extraAnnotations:
      traefik.ingress.kubernetes.io/priority: "1"
      traefik.ingress.kubernetes.io/auth-type: "forward"
      traefik.ingress.kubernetes.io/auth-url: "http://traefik-forward-auth-kubeaddons.kubeaddons.svc.cluster.local:4181/"
      traefik.ingress.kubernetes.io/auth-response-headers: "X-Forwarded-User"
```

Each Ingress setting has the option to edit the hosts, paths, and annotations used so that they can be customized.

### Namespaces

Unless otherwise specified, the Dispatch CLI commands create repositories, secrets, pipelines, and tasks in the `default` namespace. For production installations, we suggest you create a new namespace dedicated to your CI workloads. For example, `dispatch-work` or `dispatch-ci`. You will then specify that namespace when using the CLI.

Examples:

```bash
dispatch -n dispatch-ci login docker --serviceaccount=team1
```

or

```bash
dispatch -n dispatch-work create repository
```

To install Dispatch into a Kubernetes cluster:

1.  Execute the command `dispatch init`, which will use Helm v3 to perform the installation in a release called `dispatch`:

    ```bash
    dispatch init
    ```

1. Set `--namespace` to install Dispatch into a namespace other than `dispatch`.
1. If you want to restrict the namespaces to which Dispatch has access, set the `--watch-namespace` flag for each namespace to which Dispatch should have access.
1. Run `helm test dispatch` to verify that the Dispatch components are set up correctly.

This will take several minutes, but your Dispatch cluster will be fully ready for use once it is completed.

### Buildkit

[Buildkit](https://github.com/moby/buildkit) is not enabled by default as it requires `cert-manager` to be installed into your cluster. However, it can be enabled by setting `buildkit.enabled`.

It is also possible to override the buildkit image used, the number of replicas, and the resources allocated to each replica. The default configuration is:

```
buildkit:
  enabled: false
  image: "moby/buildkit:v0.7.1"
  resources:
    requests:
      memory: 4Gi
      cpu: 4000m
    limits:
      memory: 4Gi
      cpu: 4000m
```

In Konvoy, set the following:

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
        buildkit:
          enabled: true
```

Otherwise, run:

```
dispatch init --set buildkit.enabled=true
```

## Install Dispatch into a Cluster via Helm

Dispatch can be installed using Helm v3 directly.

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

# Next steps

At this point, you've successfully installed Dispatch. Next, you will add a new application to Dispatch CI. To do so, follow the steps
at [Setting up a repository to use Dispatch](../../tutorials/ci_tutorials/repo-setup/).

Additionally, your installation of Dispatch may require customization of [MinIO](../configure-minio/) to meet the requirements.
