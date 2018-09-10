---
layout: layout.pug
navigationTitle: Using Package Registry
title: Using Package Registry
menuWeight: 25
excerpt: How to Use DC/OS Package Registry
beta: true
enterprise: true
---

### Installing DC/OS Package Registry CLI

DC/OS Package Registry comes installed with a CLI, but if the need arises to install again, use the following command:

```bash
dcos package install package-registry --cli
```

### Downloading Packages

For a list of DC/OS Packages supported by DC/OS Package Registry see the [offical list of supported packages](https://downloads.mesosphere.com/universe/packages/packages.html). To download a version of Jenkins:

```bash
wget https://downloads.mesosphere.com/universe/packages/jenkins/3.4.0-2.89.2/jenkins-3.4.0-2.89.2.dcos
```

### Adding Packages

DC/OS Packages are added to a DC/OS Package Registry with the `dcos registry add` command. To add a version of Jenkins to a registry, enter:

```bash
dcos registry add --dcos-file jenkins-3.4.0-2.89.2.dcos
```

### Describing and Listing Packages

Use the `dcos registry describe` command to describe a DC/OS Package. For example, to describe a version of the Jenkins DC/OS Package, enter:

```bash
dcos registry describe --package-name jenkins --package-version 3.4.0-2.89.2
```

Morever, to list all added packages:

```bash
dcos package search
```

### Removing Packages

Use the `dcos registry remove` command to remove an added DC/OS Package. For example, to remove a version of the Jenkins DC/OS Package, enter:

```bash
dcos registry remove --package-name jenkins --package-version 3.4.0-2.89.2
```

Note: Removing a package while a service is still deployed may cause the service to stop working.

### Installing DC/OS Services from DC/OS Packages

A DC/OS Service can be installed from the packages added to the DC/OS Package Registry using either the CLI or the GUI. For example, to install a version of Jenkins using the CLI, enter:

```bash
dcos package install jenkins
```
