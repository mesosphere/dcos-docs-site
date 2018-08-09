---
layout: layout.pug
navigationTitle: Via Package Registry
title: Via Package Registry
menuWeight: 20
excerpt: Instructions for installing the DC/OS Storage Service using the package registry.
enterprise: true
---

# Prerequisites

- DC/OS Enterprise 1.12 or above.
- [DC/OS CLI](/latest/cli/install/) is installed and has been logged in as a superuser.

# Install package registry

<!--- Change the link once https://jira.mesosphere.com/browse/DCOS-39865 is resolved. -->
Please follow these [instructions](https://github.com/mesosphere/package-registry/blob/master/docs/getting-started.markdown) to install the package registry.

# Download the DSS package

The `.dcos` package of the DC/OS Storage Service (DSS) can be downloaded from [Mesosphere support site](https://support.mesosphere.com/hc/en-us/articles/213198586).

# Install the DSS package

Assume that the downloaded package is called `beta-storage.dcos` in the current working directory.

```bash
$ dcos registry add --dcos-file beta-storage.dcos
$ dcos package install beta-storage --package-version=<VERSION>
```

# Verify that the DSS is running

Run the following command and wait for the DSS to be ready.

```bash
$ dcos storage version
```
