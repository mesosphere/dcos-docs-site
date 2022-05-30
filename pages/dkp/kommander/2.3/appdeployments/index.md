---
layout: layout.pug
navigationTitle: AppDeployments
title: AppDeployments
excerpt: Use AppDeployments to deploy, and customize platform, DKP catalog, and custom applications in your environment
menuWeight: 50
beta: false
enterprise: false
---

An `AppDeployment` is a [Custom Resource][CRD] created by DKP with the purpose of deploying applications (platform, DKP catalog and custom applications) in the management cluster, managed clusters, or both. Customers of both Essential and Enterprise products use `AppDeployments`, regardless of their setup (networked, air-gapped, etc.), and their infrastructure provider.

When installing DKP, an `AppDeployment` resource is created for each enabled **platform application**. This `AppDeployment` resource references a `ClusterApp`, which then references the repository that contains a concrete declarative and preconfigured setup of an application, usually in the form of a [`HelmRelease`][helm]. `ClusterApps` are cluster-scoped so that these platform applications are deployable to all workspaces or projects.

In the case of **DKP catalog** and **custom applications**, the `AppDeployment` references an `App` instead of a `ClusterApp`, which also references the repository containing the installation and deployment information. `Apps` are namespace-scoped and are meant to only be deployable to the workspace or project in which they have been created.

For example, this is the default `AppDeployment` of Kube Prometheus Stack:

```yaml
apiVersion: apps.kommander.d2iq.io/v1alpha2
kind: AppDeployment
metadata:
  name: kube-prometheus-stack
  namespace: <your-workspace-namespace>
spec:
  appRef:
    name: kube-prometheus-stack-33.1.5
    kind: ClusterApp
```

## Customization

If you want to customize an application, or change how a specific app is deployed, you can create a `ConfigMap` to change or add values to the information that is stored in the `HelmRelease`. Override the default configuration of an application by setting the `configOverrides` field on the `AppDeployment` to that `ConfigMap`.

For example, this is a customized `AppDeployment` of Kube Prometheus Stack:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: apps.kommander.d2iq.io/v1alpha2
kind: AppDeployment
metadata:
  name: kube-prometheus-stack
  namespace: <your-workspace-namespace>
spec:
  appRef:
    name: kube-prometheus-stack-33.1.5
    kind: ClusterApp
  configOverrides:
    name: kube-prometheus-stack-overrides-attached
EOF
```

## Deployment scope

In a single-cluster environment with an **Essential license**, `AppDeployments` enable customizing any platform or catalog application.

In a multi-cluster environment with an **Enterprise license**, `AppDeployments` enable [workspace-level][workspace], [project-level][project], and per-cluster deployment and customization of applications.
<!-- TODO: link to the per-cluster topic(s) once they are created-->

<!-- TODO: change links to Applications topics from workplace, project sections once they have been moved-->

## More information

Refer to the [CLI documentation][cli] for more information on how to `create`, or `get` an `AppDeployment`.

[CRD]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
[helm]: https://fluxcd.io/docs/components/helm/helmreleases/
[workspace]: ../workspaces/applications/
[project]: ../projects/applications/
[cli]: ../cli/dkp/
