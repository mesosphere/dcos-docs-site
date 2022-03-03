---
layout: layout.pug
navigationTitle: Helm CLI
title: Helm CLI
menuWeight: 5
excerpt: Helm CLI Usage
beta: false
enterprise: false
---

This section describes how to install the Helm CLI. Helm can be installed either from source or from pre-built binary releases. This topic focuses on installing the latest Helm binaries, which is known as Helm 3.

You may encounter some situations where you need to use an older version of Helm, known as Helm 2. If so, see the Helm documentation.

## What Is Helm

Helm is a tool that streamlines installing and managing Kubernetes applications. It provides managed packages called _charts_, which is a collection of related Kubernetes resources. Helm allows for customization, installation, upgrades, and rollback of packages.

### Key Features

- Repository of managed packages
- Custom repositories for personal packages
- Mechanisms for upgrading packages
- Templating

## Before you begin

You need certain software configurations and settings before you start this procedure. This procedure requires the following items and configurations:

- A running Kubernetes cluster

## Install Helm from the binaries

Every Helm [release][helm-release] provides binaries for a variety of operating systems. These binary versions can be manually downloaded and installed.

1.  Download and unpack the [latest][helm-release-latest] release. Here is an example for the version [3.8.0][helm-3.8.0].

    ```bash
    wget -c https://get.helm.sh/helm-v3.8.0-linux-amd64.tar.gz -O - | tar -xz
    ```

1.  Add the binary to your path:

    ```bash
    mv linux-amd64/helm /usr/local/bin/
    ```

1.  Check if everything is working as expected:

    ```bash
    helm help
    ```

## Install Helm from a Package Manager

The Helm community also contributes and maintains packages to several package managers. These are not officially supported, but are generally up-to-date. Here is how to install Helm using [Homebrew (MacOS)][homebrew-helm-mac], [Chocolatey (Windows)][homebrew-helm-windows], and [Apt (Debian/Ubuntu)][homebrew-helm-ubuntu].

## Add a Helm Chart Repository

After installing a Helm binary, add a Helm chart repository. To add and access the official Helm chart repository, enter the following command:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
```

## Install a Helm Chart

After adding the repo, you can install your first Helm chart.

1.  Update local information about the available charts. Enter the following command:

    ```bash
    helm repo update
    ```

    <!-- vale Vale.Spelling = NO -->
1.  As an example, you can install a MySQL chart creating a _Release_. A _Release_ is an instance of a chart running in a cluster. This release is named _mydb_. Enter the following command:
    <!-- vale Vale.Spelling = YES -->

    ```bash
    helm install mydb bitnami/mysql
    ```

1.  List all installed charts and check their status. Enter the following command:

    ```bash
    helm ls
    ```

    ```sh
    NAME    NAMESPACE    REVISION    UPDATED                                 STATUS      CHART          APP VERSION
    mydb    default      1           2022-02-06 18:06:24.41517 +0200 CEST    deployed    mysql-8.8.25    8.0.28
    ```

## Related information

For information on Helm, refer to the following:

- [Chart customization prior to the installation][helm-custom-chart]
- [Upgrading a release and failure recovery][helm-upgrade-recovery]
- [Uninstalling a release][helm-uninstall]
- [Helm repository management][helm-management]
- [Creating your own charts][helm-create-charts]

[helm-3.8.0]: https://github.com/helm/helm/releases/tag/v3.8.0
[helm-create-charts]: https://helm.sh/docs/intro/using_helm/#creating-your-own-charts
[helm-custom-chart]: https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing
[helm-management]: https://helm.sh/docs/intro/using_helm/#helm-repo-working-with-repositories
[helm-release]: https://github.com/helm/helm/releases
[helm-release-latest]: https://github.com/helm/helm/releases/latest
[helm-uninstall]: https://helm.sh/docs/intro/using_helm/#helm-uninstall-uninstalling-a-release
[helm-upgrade-recovery]: https://helm.sh/docs/intro/using_helm/#helm-upgrade-and-helm-rollback-upgrading-a-release-and-recovering-on-failure
[homebrew-helm-mac]: https://helm.sh/docs/intro/install/#from-homebrew-macos
[homebrew-helm-ubuntu]: https://helm.sh/docs/intro/install/#from-apt-debianubuntu
[homebrew-helm-windows]: https://helm.sh/docs/intro/install/#from-chocolatey-windows
