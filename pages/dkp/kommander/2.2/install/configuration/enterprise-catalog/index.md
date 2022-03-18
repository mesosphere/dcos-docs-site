---
layout: layout.pug
navigationTitle: Configure enterprise catalog
title: Configure enterprise catalog
menuWeight: 30
excerpt: Configure enterprise catalog for Kommander
beta: false
enterprise: true
---

Kommander supports configuring default catalog(s) for clusters with enterprise license.

## Configure a default enterprise catalog

To configure Kommander to use a default catalog repository, create the following yaml file:

```yaml
apiVersion: config.kommander.mesosphere.io/v1alpha1
kind: Installation
catalog:
  repositories:
    - name: dkp-catalog-applications
      labels:
        kommander.d2iq.io/project-default-catalog-repository: "true"
        kommander.d2iq.io/workspace-default-catalog-repository: "true"
        kommander.d2iq.io/gitapps-gitrepository-type: "dkp"
      gitRepositorySpec:
        url: https://github.com/mesosphere/dkp-catalog-applications
        ref:
          tag: v2.2.0
```

This configuration can be used when installing or reconfiguring Kommander by passing it to the `kommander install` command:

```bash
kommander install --installer-config <config_file.yaml>
```

This is the meaning of each label

| Label  |  Description |
|---|---|
| `kommander.d2iq.io/project-default-catalog-repository`  | Indicates this acts as a Catalog Repository in all projects  |
| `kommander.d2iq.io/workspace-default-catalog-repository`  | Indicates this acts as a Catalog Repository in all workspaces  |
| `kommander.d2iq.io/gitapps-gitrepository-type`  |  Indicates this Catalog Repository (and thus, all its Applications) are certified to be working on DKP platform |

When running in airgapped environments, update the above configuration by replacing `gitRepositorySpec` with `path` field pointing to a local path of the catalog git repository folder. For e.g.:

```bash
git clone https://github.com/mesosphere/dkp-catalog-applications
```

and then 

```yaml
apiVersion: config.kommander.mesosphere.io/v1alpha1
kind: Installation
catalog:
  repositories:
    - name: dkp-catalog-applications
      labels:
        kommander.d2iq.io/project-default-catalog-repository: "true"
        kommander.d2iq.io/workspace-default-catalog-repository: "true"
        kommander.d2iq.io/gitapps-gitrepository-type: "dkp"
      path: ./dkp-catalog-applications
```
