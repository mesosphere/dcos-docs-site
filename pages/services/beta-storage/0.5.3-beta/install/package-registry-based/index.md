---
layout: layout.pug
navigationTitle: Via Package Registry
title: Via Package Registry
menuWeight: 20
excerpt: Installing the DC/OS Storage Service using the package registry
enterprise: true
beta: true
---
#include /services/include/beta-software-warning.tmpl

# Prerequisites

- DC/OS Enterprise 1.12 or later.
- [DC/OS CLI](/latest/cli/install/) is installed and you are logged in as a superuser.

# Install package registry

Please follow these [instructions](/latest/administering-clusters/repo/package-registry/) to install the package registry.

# Download the DSS package

The `.dcos` package of the DC/OS Storage Service (DSS) can be downloaded from [Mesosphere support site](https://support.mesosphere.com/hc/en-us/articles/213198586). Please note that you must have a Mesosphere support account in order to download software from this page.

# Install the DSS package

1. Assume that the downloaded package is called `beta-storage.dcos` in the current working directory. Run the `dcos registry add` command to add it.

    ```bash
    $ dcos registry add --dcos-file beta-storage.dcos
    ```
1. Run the `dcos package install` command to install your beta-storage app:

    ```
    $ dcos package install beta-storage --package-version=<VERSION>
    ```

# Verify that the DSS is running

Run the `dcos storage version` command and wait for the DSS to be ready.

```bash
$ dcos storage version
```
