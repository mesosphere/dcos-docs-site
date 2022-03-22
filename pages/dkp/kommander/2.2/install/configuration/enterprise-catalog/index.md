---
layout: layout.pug
navigationTitle: Configure an Enterprise catalog
title: Configure an Enterprise catalog
menuWeight: 30
excerpt: Configure an Enterprise catalog for Kommander
beta: false
enterprise: true
---

Kommander supports configuring default catalog(s) for clusters with Enterprise license.

## Configure a default Enterprise catalog

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

Use this configuration when installing or reconfiguring Kommander by passing it to the `kommander install` command:

```bash
kommander install --installer-config <config_file.yaml>
```

Review the meaning of each label:

| Label  |  Description |
|---|---|
| `kommander.d2iq.io/project-default-catalog-repository`  | Indicates this acts as a Catalog Repository in all projects  |
| `kommander.d2iq.io/workspace-default-catalog-repository`  | Indicates this acts as a Catalog Repository in all workspaces  |
| `kommander.d2iq.io/gitapps-gitrepository-type`  |  Indicates this Catalog Repository (and all its Applications) are certified to run on DKP |

### Air-gapped Catalog Configuration

When running in air-gapped environments, update the configuration by replacing `gitRepositorySpec` with the `path` field pointing to a local path of the catalog git repository folder, for example:

```bash
git clone https://github.com/mesosphere/dkp-catalog-applications
```

And then:

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
