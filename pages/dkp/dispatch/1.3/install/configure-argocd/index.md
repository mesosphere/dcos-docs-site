---
layout: layout.pug
navigationTitle:  Configure ArgoCD
title: Configure ArgoCD
menuWeight: 40
beta: false
excerpt: Customize the ArgoCD default installation.
---
# ArgoCD

## Scaling

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

## Single Sign-On (SSO)

ArgoCD only has a single built-in user: the `admin` user. It has no internal users database and relies on an external OpenID Connect (OIDC) Identity Provider to authenticate regular users.

On Konvoy, the Dex kubeaddon can act as an Identity Provider. See [Setting up an external identity provider](/dkp/konvoy/latest/access-authentication/oidc/) for more information on how to connect Dex to your external Identity Provider.

Once you have configured Dex, you can configure ArgoCD to use it as an OIDC Identity Provider by setting the following configuration when installing Dispatch:

```bash
dispatch init \
  --set argo-cd.konvoyDex.enabled=true
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
          konvoyDex:
            enabled: "true"
```

This configures both ArgoCD and Dex to allow users to log in to ArgoCD using the pre-configured Konvoy SSO.

### Configuring Ingress Authentication

As Konvoy (specifically `traefik-forward-auth`) and ArgoCD manage user sessions independently, you will notice that users are forced to log in twice to reach the ArgoCD UI: the first time to authenticate with the ingress controller (via the `traefik-forward-auth` Konvoy component) and a second time for ArgoCD itself.

As ArgoCD performs its own authentication, you can disable Konvoy's ingress controller authentication for the `/dispatch/argo-cd` route by setting the following configuration when installing Dispatch:


```bash
dispatch init \
  --set argo-cd.server.ingress.annotations."traefik\.ingress\.kubernetes\.io\/auth-type"=""
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
            ingress:
              annotations:
                traefik.ingress.kubernetes.io/auth-type: ""
```


## Default Role

On Konvoy, ArgoCD UI is guarded by the cluster's authentication mechanism (i.e., `traefik-forward-auth`). As such, ArgoCD's own security is disabled and any user that can authenticate with the cluster effectively has admin privileges.

If you want to enable ArgoCD security, you can do so by disabling anonymous access and specifying a default role for users that are logged in. There are three built-in roles to choose from:

* `"role:readonly"`: Logged in users can see applications, and other resources.
* `"role:admin"`: Logged in users can manage any aspect of ArgoCD.
* `""`: No role at all means logged in users cannot access any ArgoCD resources.

You can set the default role and disable anonymous login using following settings when installing Dispatch:

```bash
dispatch init \
  --set argo-cd.server.config.users.anonymous.enabled=false \
  --set argo-cd.server.rbacConfig.policy.default="role:readonly" \
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
            config:
              users.anonymous.enabled: "false"
            rbacConfig:
              policy.default: "role:readonly"
```

To view the ArgoCD UI, log in with username `admin` and the admin user password. By default, the ArgoCD admin user password is set to the name of first `argocd-server` pod.

You can see the name of the pod using:

```
kubectl -n dispatch get pod -l app.kubernetes.io/name=argocd-server
```

## RBAC

ArgoCD supports RBAC for operations on applications, clusters, repository credentials, etc. ArgoCD has no built-in user management and relies on Signle Sign-On to be configured. With Single-Sign On configured, ArgoCD `roles` can be applied to OIDC groups. By default, ArgoCD has two built-in roles: `role:readonly` and `role:admin`.

For example, the following policy grants admin permission to users in the `myorg:engineers` team and readonly access to users in the `myorg:interns` team.

```
g, myorg:engineers, role:admin
g, myorg:interns, role:readonly
```

You can specify RBAC policies by providing the `argo-cd.server.rbacConfig.policy.csv` setting when installing Dispatch. In the following example anonymous login is disabled, no default role is specified and the example policy is specified. We use a `values.yaml` file instead of repeated `--set key=value` options to simplify multi-line input for the `policy.csv` property:

```yaml
argo-cd:
  server:
    config:
      users.anonymous.enabled: "false"
    rbacConfig:
      policy.default: ""
      policy.csv: |
        g, myorg:engineers, role:admin
        g, myorg:interns, role:readonly
```

Then run `dispatch init --values values.yaml`

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
            config:
              users.anonymous.enabled: "false"
            rbacConfig:
              policy.default: ""
              policy.csv: |
                g, myorg:engineers, role:admin
                g, myorg:interns, role:readonly
```

You can read more about [ArgoCD RBAC in their documentation](https://argoproj.github.io/argo-cd/operator-manual/rbac/).
