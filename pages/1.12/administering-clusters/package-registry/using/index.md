---
layout: layout.pug
navigationTitle: Using Package Registry
title: Using Package Registry
menuWeight: 5
excerpt: How to Use DC/OS Package Registry
beta: true
enterprise: true
---

### Installing DC/OS Package Registry CLI

Installing the DC/OS Package Registry also installs the CLI for it (`dcos registry`). The CLI can be installed again with:

```bash
dcos package install package-registry --cli
```

### Downloading Packages

For a list of DC/OS Packages supported by the DC/OS Package Registry see here. To download a version of Jenkins:

```bash
wget https://downloads.mesosphere.com/universe/packages/jenkins/3.4.0-2.89.2/jenkins-3.4.0-2.89.2.dcos
```

### Adding Packages

DC/OS Packages are added to the DC/OS Package Registry with the `dcos registry add` command. To add a version of Jenkins to the DC/OS Packager Registry:

```bash
dcos registry add --dcos-file jenkins-3.4.0-2.89.2.dcos
```

### Describing and Listing Packages

Use the `dcos registry describe` command to describe a DC/OS Package. For example, to describe a version of the Jenkins DC/OS Package:

```bash
dcos registry describe --package-name jenkins --package-version 3.4.0-2.89.2
```

List all added packages with:

```bash
dcos package search
```

### Removing Packages

Use the `dcos registry remove` command to remove an added DC/OS Package. For example, to remove a version of the Jenkins DC/OS Package:

```bash
dcos registry remove --package-name jenkins --package-version 3.4.0-2.89.2
```

Note: Removing a package while a service is still deployed may cause the service to stop working.

### Installing DC/OS Services from DC/OS Packages

A DC/OS Services can be installed from DC/OS Packages added to the DC/OS Package Registry using either the CLI or the UI. For example, to install a version of Jenkins:

```bash
dcos package install jenkins
```
