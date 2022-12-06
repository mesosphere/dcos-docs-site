---
layout: layout.pug
navigationTitle: Configure an Enterprise catalog
title: Configure an Enterprise catalog
menuWeight: 30
excerpt: Configure an Enterprise catalog for Kommander
beta: false
enterprise: true
---

Kommander supports configuring default catalogs for clusters with Enterprise license.

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
          tag: v2.2.2
```

Use this configuration when installing or reconfiguring Kommander by passing it to the `dkp install kommander` command:

<p class="message--note"><strong>NOTE: </strong>To ensures Kommander is installed on the workload cluster, use the <code>--kubeconfig=cluster_name.conf</code> flag as an alternative to KUBECONFIG. </p>

```bash
dkp install kommander --installer-config <config_file.yaml>
```

<p class="message--note"><strong>NOTE: </strong>When configuring the catalog repository post-upgrade, run <code>dkp install kommander --init > install.yaml</code> and update it accordingly with any custom configuration. This ensures you are using the proper default configuration values for the new Kommander version.</p>

The following section describes each label:

| Label                                                    | Description                                                                              |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `kommander.d2iq.io/project-default-catalog-repository`   | Indicates this acts as a Catalog Repository in all projects                              |
| `kommander.d2iq.io/workspace-default-catalog-repository` | Indicates this acts as a Catalog Repository in all workspaces                            |
| `kommander.d2iq.io/gitapps-gitrepository-type`           | Indicates this Catalog Repository (and all its Applications) are certified to run on DKP |

### Air-gapped Catalog Configuration

When running in air-gapped environments, update the configuration by replacing `gitRepositorySpec` with the `path` field pointing to a local path of the DKP catalog applications git repository.

1.  Download the DKP catalog application Git repository archive:

    ```bash
    wget "https://downloads.d2iq.com/dkp/v2.2.2/dkp-catalog-applications-v2.2.2.tar.gz" -O dkp-catalog-applications.tar.gz
    ```

<p class="message--note"><strong>NOTE: </strong>This docker image includes code from the MinIO Project (“MinIO”), which is © 2015-2021 MinIO, Inc. MinIO is made available subject to the terms and conditions of the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU Affero General Public License 3.0</a>. Complete source code for MinIO is available <a href="https://github.com/minio/minio/tree/RELEASE.2021-02-14T04-01-33Z">here</a>, <a href="https://github.com/minio/minio/tree/RELEASE.2022-02-24T22-12-01Z">here</a>, and <a href="https://github.com/minio/minio/tree/RELEASE.2022-01-08T03-11-54Z">here</a></p>

1.  Update the Kommander configuration file with:

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
          path: ./dkp-catalog-applications.tar.gz
    ```

    <p class="message--note"><strong>NOTE: </strong>When configuring the catalog repository post-upgrade, run <code>dkp install kommander --init > install.yaml</code> and update it accordingly with any custom configuration. This ensures you are using the proper default configuration values for the new Kommander version.</p>

1.  Use this configuration when installing or reconfiguring Kommander by passing it to the `dkp install kommander` command:

    ```bash
    dkp install kommander --installer-config <config_file.yaml>
    ```
