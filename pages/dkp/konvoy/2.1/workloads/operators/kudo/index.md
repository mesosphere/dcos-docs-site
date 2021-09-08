---
layout: layout.pug
navigationTitle: KUDO Operators
title: KUDO Operators
menuWeight: 8
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->
## KUDO

The Kubernetes Universal Declarative Operator - [KUDO][kudo] - is a way of building Kubernetes operators in a declarative way. From a workload perspective, it defines a way to package manifest files in a gzipped tar file (an archive file with a .tgz file extension). The files in this tgz file are templated files that produce the standard manifest files identified in the [user workload section][user-workloads].

<p class="message--note"><strong>NOTE: </strong>KUDO operators require a <a href="https://kudo.dev/docs/architecture.html#architecture-diagram">KUDO controller</a> running in the cluster.</p>

## Before you begin
To run the KUDO controller or any KUDO workloads beyond the standard workload prerequisites, you must have the following installed:

- Kubernetes [Certification Manager][cert-man]
- KUDO [Custom Resource Definitions (CRDs)][crd]

The KUDO CLI has features that assist with the installation of the CRDs and, for development purposes only, the ability to install a development version of a certification manager.

## Run the KUDO controller
To start the KUDO controller workload in the cluster run: `kubectl kudo init`

This installs the KUDO CRDs and runs the KUDO controller in the `kudo-system` namespace.

```bash
kubectl get pod -n kudo-system
NAME                        READY   STATUS    RESTARTS   AGE
kudo-controller-manager-0   1/1     Running   0          6m47s
```

## Run a KUDO Operator
With the KUDO controller running in the cluster, you can install a KUDO operator. KUDO operators are packaged in a tgz file and can be located anywhere. They can be referenced from the filesystem, or from a URL directly. Generally they are served from a [KUDO repository][kudo-arch]. During a `kubectl kudo init`, the default client initialization is performed along with the installation of the KUDO controller. The default repository is called the "community" repository and can be identified using the following:

```bash
kubectl kudo repo list
NAME        URL
*community  https://kudo-repository.storage.googleapis.com/0.10.0
```

To install a KUDO operator / workload, run `kubectl kudo install`:

```bash
kubectl kudo install zookeeper
operator default/zookeeper created
operatorversion default/zookeeper-3.4.14-0.3.1 created
instance default/zookeeper-instance created
```

The KUDO operators can have any number of workloads associated with them, which can change depending on installation configuration. For more details, see the [KUDO][kudo] project site.

## Related information

For information on related topics or procedures, refer to the following:

- [Creating a KUDO Package][package-kudo]
- [Create a local KUDO Repository][local-repo]
- [Add a KUDO Package to a Repository][add-to-repo]

[add-to-repo]: https://kudo.dev/docs/runbooks/admin/add-operator-to-repository.html
[cert-man]: https://cert-manager.io/docs/installation/kubernetes/
[crd]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
[kudo]: https://kudo.dev/
[kudo-arch]: https://kudo.dev/docs/architecture.html#architecture-diagram
[local-repo]: https://kudo.dev/docs/runbooks/admin/local-repo.html
[package-kudo]: https://kudo.dev/docs/runbooks/admin/create-kudo-package.html
[user-workloads]: ../../user-workloads
