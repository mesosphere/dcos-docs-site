---
layout: layout.pug
navigationTitle: Installing
title: Installing
menuWeight: 25
excerpt: Installing a DC/OS Package Registry
enterprise: true
---

# Installing DC/OS Package Registry CLI

DC/OS Package Registry comes installed with a CLI, but if you need to install it again, use the following command:

```bash
dcos package install package-registry --cli
```

## Downloading Packages

For a list of DC/OS Packages supported by DC/OS Package Registry see the [offical list of supported packages](https://downloads.mesosphere.com/universe/packages/packages.html).

**Example**: To download a version of Jenkins:

```bash
wget https://downloads.mesosphere.com/universe/packages/jenkins/3.5.2-2.107.2/jenkins-3.5.2-2.107.2.dcos
```

### Adding Packages

DC/OS Packages are added to a DC/OS Package Registry with the `dcos registry add` command.

**Example**: To add a version of Jenkins to a registry, enter:

```bash
dcos registry add --dcos-file jenkins-3.5.2-2.107.2.dcos
```

### Describing and Listing Packages

Use the `dcos registry describe` command to describe a DC/OS Package.

**Example**: To describe a version of the Jenkins DC/OS Package, enter:

```bash
dcos registry describe --package-name jenkins --package-version 3.5.2-2.107.2
```

To list all added packages:

```bash
dcos package search
```

### Removing Packages

Use the `dcos registry remove` command to remove an added DC/OS Package.

**Example**: To remove a version of the Jenkins DC/OS Package, enter:

```bash
dcos registry remove --package-name jenkins --package-version 3.5.2-2.107.2
```

<p class="message--warning"><strong>WARNING: </strong>Removing a package while a service is still deployed may cause the service to stop working.</p>

### Installing DC/OS Services from DC/OS Packages

A DC/OS Service can be installed from the packages added to the DC/OS Package Registry using either the CLI or the GUI.

**Example**: To install a version of Jenkins using the CLI, enter:

```bash
dcos package install jenkins
```
