---
layout: layout.pug
navigationTitle: KUDO CLI
title: KUDO CLI
menuWeight: 5
excerpt: KUDO CLI Usage
beta: false
enterprise: false
---

This section describes how to install the Kubernetes Universal Declarative Operator (KUDO) CLI and initialize the KUDO cluster component.

## What Is KUDO

KUDO provides a declarative approach to building and installing production-grade Kubernetes operators. To quote the official documentation: "Operators are software extensions to Kubernetes that make use of custom resources to manage applications and their components." While Kubernetes already comes with a lot of built-in automation to run simple workloads, complex scenarios often need a human operator. This is where KUDO is designed to help.

### Key Features

Key features of KUDO are:

- Repository of managed packages
- Custom repositories for own packages
- Mechanisms for upgrading packages
- Templating support focused on on Day-2 operations. KUDO can configure an entire Operator’s lifecycle using a declarative spec. This allows for further interactions with installed applications like triggering a backup/restore.

## Before you begin

You need certain software configurations and settings before you start this procedure. This procedure requires the following items and configurations:

- A running Kubernetes cluster

## Install Kudo using krew

Using [krew](https://krew.sigs.k8s.io/), the package manager for kubectl plugins, is the easiest way to install KUDO CLI. Install KUDO CLI by entering the following command:

```bash
kubectl krew install kudo
```

Check if KUDO CLI installed properly. Enter the following command:

```bash
kubectl kudo help
```

## Install KUDO on MacOS

Use brew to install KUDO CLI on MacOS. Enter the following command:

```bash
brew tap kudobuilder/tap
brew install kudo-cli
```

## Install KUDO on Linux

Use [latest release][kudo-latest] page to download the CLI binaries for your platform. Use this script to download the correct binary and add it to your path:

```bash
VERSION=x.y.z # look up the current stable release at https://github.com/kudobuilder/kudo/releases/latest
OS=$(uname | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
wget -O kubectl-kudo https://github.com/kudobuilder/kudo/releases/download/v${VERSION}/kubectl-kudo_${VERSION}_${OS}_${ARCH}
chmod +x kubectl-kudo
# add to your path
sudo mv kubectl-kudo /usr/local/bin/kubectl-kudo
```

## Initialize KUDO

Unlike [Helm][helm], KUDO has an installed component, called KUDO Manager, inside the cluster. Install KUDO Manager. Enter the following commands:

```bash
kubectl kudo init
```

This command installs all the cluster components required for KUDO to work. The `init` command aborts if it detects an existing KUDO installation, preventing accidental upgrades. For more information on how to customize the KUDO initialization, see the [init command][kudo-init]. To upgrade an existing KUDO installation, see [kudo upgrade][kudo-upgrades].

## Install a KUDO Operator

There are several ways to install a KUDO operator. KUDO comes with a preconfigured official [operators repository][kudo-operators].

1. As an example, install an [instance][kudo-instance] of Zookeeper operator named `zk` by entering the following command:

```bash
kubectl kudo install zookeeper --instance zk
```

1. Check the status of the instance. Enter the following command:

```bash
$ kubectl kudo plan status --instance zk
Plan(s) for "zk" in namespace "default":
.
└── zk (Operator-Version: "zookeeper-0.3.1" Active-Plan: "deploy")
    ├── Plan deploy (serial strategy) [COMPLETE], last updated 2020-10-07 14:12:55
    │   ├── Phase zookeeper (parallel strategy) [COMPLETE]
    │   │   └── Step deploy [COMPLETE]
    │   └── Phase validation (serial strategy) [COMPLETE]
    │       ├── Step validation [COMPLETE]
    │       └── Step cleanup [COMPLETE]
    ...
```

KUDO operators can have multiple [plans][kudo-plans], defined by the operator developer, for the user to execute. Every operator must contain at least a `deploy` plan. This is the default plan to deploy an application to the cluster. In the above output, Zookeepers `deploy` plan consists of two [phases][kudo-phases]. Each of these phases have several steps which have completed by now.

## Related information

For information on KUDO, refer to the following:

- [Instance parametrization][helm-param]
- [Upgrading an instance][kudo-upgrade-instance]
- [Collecting diagnostics][kudo-diagnostics]
- [Managing repositories][kudo-repos]
- [Developing operators][helm-operators]

[helm]: ../helm
[helm-operators]: https://helm.sh/docs/intro/using_helm/#creating-your-own-charts
[helm-param]: https://helm.sh/docs/intro/using_helm/#customizing-the-chart-before-installing
[krew]: https://github.com/kubernetes-sigs/krew
[kudo-diagnostics]: https://kudo.dev/docs/cli/examples.html#collecting-diagnostic-data
[kudo-init]: https://kudo.dev/docs/cli/commands.html#init
[kudo-instance]: https://kudo.dev/docs/what-is-kudo.html#under-the-hood
[kudo-latest]: https://github.com/kudobuilder/kudo/releases/latest
[kudo-operators]: https://github.com/kudobuilder/operators
[kudo-phases]: https://kudo.dev/docs/developing-operators/plans.html#plans
[kudo-plans]: https://kudo.dev/docs/what-is-kudo.html#operator-plans
[kudo-repos]: https://kudo.dev/docs/cli/examples.html#managing-repositories
[kudo-upgrade-instance]: https://kudo.dev/docs/cli/examples.html#upgrade-instance-from-one-version-to-another
[kudo-upgrades]: https://kudo.dev/docs/cli/installation.html#kudo-upgrades
