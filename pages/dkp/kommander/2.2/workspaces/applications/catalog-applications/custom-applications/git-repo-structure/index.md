---
layout: layout.pug
navigationTitle: Git repository structure
title: Git repository structure
beta: true
menuWeight: 20
excerpt: Git repositories must be structured in a specific manner for defined applications to be processed by Kommander.
---

<!-- markdownlint-disable MD030 -->

You must structure your git repository based on the following guidelines, for your applications to be processed properly by Kommander so that they can be deployed.

## Git repository directory structure

Use the following basic directory structure for your git repository:

```txt
├── helm-repositories
│   ├── <helm repository 1>
│   │   ├── kustomization.yaml
│   │   └── <helm repository name>.yaml
│   └── <helm repository 2>
│       ├── kustomization.yaml
│       └── <helm repository name>.yaml
└── services
    ├── <app name>
    │   ├── <app version1> # semantic version of the app helm chart. e.g., 1.2.3
    │   │   ├── defaults
    │   │   │   ├── cm.yaml
    │   │   │   └── kustomization.yaml
    │   │   ├── <app name>.yaml
    │   │   └── kustomization.yaml
    │   ├── <app version2> # another semantic version of the app helm chart. e.g., 2.3.4
    │   │   ├── defaults
    │   │   │   ├── cm.yaml
    │   │   │   └── kustomization.yaml
    │   │   ├── <app name>.yaml
    │   │   └── kustomization.yaml
    │   └── metadata.yaml
    └── <another app name>
    ...
```

- Define applications in the `services/` directory.

- You can define multiple versions of an application, under different directories nested under the `services/<app name>/` directory.

- Define application manifests, such as a [HelmRelease][helmreleases], under each versioned directory `services/<app name>/<version>/` in `<app name>.yaml` which is listed in the `kustomization.yaml` Kubernetes Kustomization file. For more information, see the [Kubernetes Kustomization docs][kubernetes_kustomization].

- Define the default values ConfigMap for `HelmReleases` in the `services/<app name>/<version>/defaults` directory, accompanied by a `kustomization.yaml` Kubernetes Kustomization file pointing to the `ConfigMap` file.

- Define the `metadata.yaml` of each application under the `services/<app name>/` directory. For more information, see the [Application Metadata docs][kommander_app_metadata].

See [the DKP Catalog repository](https://github.com/mesosphere/dkp-catalog-applications) for an example of how to structure custom catalog Git repositories.

<!-- add more details about what each file should contain? insert example yamls of each of these files? link to an example repo? -->

### Helm Repositories

You must include the `HelmRepository` that is referenced in each `HelmRelease`'s `Chart` spec.

Each `services/<app name>/<version>/kustomization.yaml` must include the path of the yaml file that defines the `HelmRepository`. For example:

```yaml
# services/<app name>/<version>/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - <app name>.yaml
  - ../../../helm-repositories/<helm repository 1>
```

For more information, see the flux documentation about [HelmRepositories][helmrepositories].

### Substitution variables

Some [substitution variables][kustomization_variable_substitution] are provided.
<!-- add more background and context on subst vars -->

- `${releaseName}`: For each App deployment, this variable is set to the `AppDeployment` name. Use this variable to prefix the names of any resources that are defined in the application directory in the Git repository so that multiple instances of the same application can be deployed. If you create resources without using the `releaseName` prefix (or suffix) in the name field, there can be conflicts if the same named resource is created in that same namespace.
- `${releaseNamespace}`: The namespace of the Project.
- `${workspaceNamespace}`: The namespace of the Workspace that the Project belongs to.

## Related Information

- [Flux][flux_website]
- [Flux docs][flux_docs]
- [Getting started with Flux guide][flux_get_started]

[kubernetes_kustomization]: https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/
[flux_website]: https://fluxcd.io/
[flux_docs]: https://fluxcd.io/docs
[flux_get_started]: https://fluxcd.io/docs/get-started/
[flux_website]: https://fluxcd.io
[kustomization_variable_substitution]: https://fluxcd.io/docs/components/kustomize/kustomization/#variable-substitution
[helmrepositories]: https://fluxcd.io/docs/components/source/helmrepositories/
[kommander_app_metadata]: ../application-metadata
[helmreleases]: https://fluxcd.io/docs/components/helm/helmreleases/
