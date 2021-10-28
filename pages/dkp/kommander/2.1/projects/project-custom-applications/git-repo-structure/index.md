---
layout: layout.pug
navigationTitle: Git repository Structure
title: Git repository Structure
menuWeight: 20
excerpt: Git repositories must be structured in a specific manner in order for defined applications to be processed by Kommander.
---

<!-- markdownlint-disable MD030 -->

You must structure your git repository based on the following guidelines, in order for your applications to be processed properly by Kommander so that they can be deployed.

## Git repository directory structure

This is the basic directory structure your git repository must follow:

```txt
└── services
    ├── <app name>
    │   ├── <app version 1.2.3>
    │   │   ├── defaults
    │   │   │   ├── cm.yaml
    │   │   │   └── kustomization.yaml
    │   │   ├── <app name>.yaml
    │   │   └── kustomization.yaml
    │   ├── <app version 2.3.4>
    │   │   ├── defaults
    │   │   │   ├── cm.yaml
    │   │   │   └── kustomization.yaml
    │   │   ├── <app name>.yaml
    │   │   └── kustomization.yaml
    │   └── metadata.yaml
    └── <another app name>
    ...
```

- Applications must be defined in the `services/` directory.

- Multiple versions of an application can be defined, in different directories nested under the `services/<app name>/` directory.

- Application manifests such as the `HelmRelease` should be defined under each versioned directory `services/<app name>/<version>/` in `<app name>/yaml` which is listed in the `kustomization.yaml` Kubernetes Kustomization file. See the  [Kubernetes Kustomization docs][kubernetes_kustomization] for more information.

- The default values ConfigMap for HelmReleases must be defined in the `services/<app name>/<version>/defaults` directory, accompanied by a `kustomization.yaml` Kubernetes Kustomization file pointing to the ConfigMap file.

<!-- add more details about what each file should contain? insert example yamls of each of these files? -->

### Substitution variables

Some [substitution variables][kustomization_variable_substitution] are provided.
<!-- add more background and context on subst vars -->

- `${releaseName}`: For each App deployment, this variable is set to the AppDeployment name. This variable should be used to prefix the names of any resources that are defined in the application directory in the git repository. This is necessary so that multiple instances of the same application can be deployed. If you create resources without using the `releaseName` prefix (or suffix) in the name field, there can be conflicts if the same named resource is created in that same namespace.
- `${releaseNamespace}`: This variable is set to the namespace of the Project.
- `${workspaceNamespace}`: This variable is set to the namespace of the Workspace that the Project belongs to.

## Related Information

- [Flux][flux_website]
- [Flux docs][flux_docs]
- [Getting started with Flux guide][flux_get_started]

[kubernetes_kustomization]: https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/
[flux_docs]: https://fluxcd.io/docs
[flux_get_started]: https://fluxcd.io/docs/get-started/
[kustomization_variable_substitution]: https://fluxcd.io/docs/components/kustomize/kustomization/#variable-substitution
