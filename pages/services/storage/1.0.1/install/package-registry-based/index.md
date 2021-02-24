---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/install/package-registry-based/index.md
navigationTitle: Via Package Registry
title: Via Package Registry
menuWeight: 20
excerpt: Installing the DC/OS Storage Service using the package registry
enterprise: true
---

# Prerequisites

- DC/OS Enterprise 1.12 or later.
- [DC/OS CLI](/latest/cli/install/) is installed and you are logged in as a superuser.

# Install package registry

Please follow these [instructions](/latest/administering-clusters/package-registry/) to install the package registry.

# Download the DSS package

You can download the `.dcos` package of the DC/OS Storage Service (DSS) from the [Mesosphere support site](https://support.mesosphere.com/hc/en-us/articles/213198586). You must have a Mesosphere support account in order to download software from this page.

# Install the DSS package

1. Assume that the downloaded package is called `storage.dcos` in the current working directory. Run the `dcos registry add` command to add it.

    ```bash
    dcos registry add --dcos-file storage.dcos
    ```
1. Run the `dcos package install` command to install the storage service:

    ```bash
    dcos package install storage --package-version=<VERSION>
    ```

# Verify that the DSS is running

Run the `dcos storage version` command and wait for the DSS to be ready.

```bash
dcos storage version
```
