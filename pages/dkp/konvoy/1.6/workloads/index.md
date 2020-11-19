---
layout: layout.pug
navigationTitle: Workloads
title: Workloads
menuWeight: 155
excerpt: Deploying Operators, Workloads, and Applications
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes different application and service workloads and how to install them onto Konvoy. It assumes familiarity with Kubernetes CLI tool (kubectl), applications, manifest files and conrollers.

## Workloads and Applications

There are various types of applications, with different styles of packaging and configurations, but in the end running applications on Kubernetes meanings running [containers][containers] in [pods][pods]. The different types of applications include:

* Stateless
* Stateful
* Control Plane extensions

A [Stateless][stateless] service is a service which does not have a need for managing state to disk. Based on the nature, scheduling stateless services is commonly less constraining and their failover does not require any coordination.

A [Stateful][stateful] service is a service which requires a way to manage [storage][storage]. Beyond storage, stateful applications often require extra coordination for scaling (up or down) and failure recovery. This extra coordination can range from the need for storage coordination to service specific needs such as data rebalancing, snapshotting, resharding, etc. The extra coordiation needed is specific to the service and can be managed manually or through a [controller][controller] which provides a control plane extension to Kubernetes.

Kubernetes is a [control plane][control-plane] for managing worker nodes and pods in the cluster. The basic control plane is domain agnostic, meaning it manages generic operators, but it can not manage application specific control needs. For this reason, Kubernetes provides the ability to [extend the Kubernetes cluster][extend-kubernetes]. There are 2 control plane extensions that are the most impactful to managing stateful services which are: [kube-apiserver][kube-apiserver] extensions called [custom resource definitions][crds] (CRD) and [controllers][controller]. CRDs provide the ability to customize the Kubernetes API with new kinds of objects. Controllers provide a way interact with new kinds of objects, observe new and existing kinds of objects, and to respond to the state of the cluster in application specific ways. The combination of these 2 Kubernetes extensions provides a way to automate a stateful service in a domain specific way. When used in this way, this service is referred to as a Kubernetes Operator.

### Workload Packaging

The core basic form for declaratively expressing a workload is a YAML manifest file(s). It is common to use versionable manifest files for standard in-house workflow deployments. Details for working with manifests can be found under [user workloads](user-workloads).

Although there are different forms of packages, it is useful to know that at the core, they generally are a way to group a set of manifest files unto a bundle for deployment as a unit. Common packaging used in this way includes:

- Helm - Defines a bundle as a "chart." There are charts for stateless, stateful and control plane extensions. Although there are charts for stateful services, it is best practice to not use them in production, using their operators as a better alternative. For more details on working with Helm, read [the Helm workload section][helm].
- KUDO Packages - Defines a [way to bundle][kudo-package] an ordered set of manifests as a KUDO Operator. KUDO means Kubernetes Universal Declarative Operator, which defines a way to create an operator through declaration. KUDO packages can be used from a URL, from the file system, and from a KUDO repository. The basics for working with KUDO is available at [using KUDO][kudo] with verbose details at [https://kudo.dev][kudo-web].
- Operator SDK - Defines another packaging mechanism for deploying operator SDK operators. Operator SDK requires the installation of OLM which is accomplished through manifest files. Operators can be found at [https://operatorhub.io/][operator-hub]. For more details from [working with Operator SDK][operator-sdk].

## Before you begin
Deploying a workload into a Kubernetes cluster, regardless of packaging, requires the following prerequisites:

- The client must be [configured][configured] for the server and namespace
- You must have authorization for the server and/or namespace
- Resources must be available for the workload within the allowed [quota][quota]
- The workload must be scheduleable according to the [configured policies][schedulable]
- The proper client tooling must be installed, which can differ depending on package type. At a minimum, `kubectl` needs to be installed.

[configured]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
[containers]: https://kubernetes.io/docs/concepts/containers/
[control-plane]: https://kubernetes.io/docs/concepts/overview/components/#:~:text=A%20Kubernetes%20cluster%20consists%20of,set%20of%20machines%20called%20nodes.&text=The%20worker%20node(s)%20host,the%20Pods%20in%20the%20cluster
[controller]: https://kubernetes.io/docs/concepts/architecture/controller/
[crds]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
[extend-kubernetes]: https://kubernetes.io/docs/concepts/extend-kubernetes/extend-cluster/
[kube-apiserver]: https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/
[kudo]: operators/kudo
[kudo-package]: https://kudo.dev/docs/developing-operators/getting-started.html#package-structure
[kudo-web]: https://kudo.dev
[helm]: helm/
[operator-hub]: https://operatorhub.io/
[operator-sdk]: operators/operator-sdk
[pods]: https://kubernetes.io/docs/concepts/workloads/pods/
[quota]: https://kubernetes.io/docs/concepts/policy/resource-quotas/
[schedulable]: https://kubernetes.io/docs/concepts/scheduling-eviction/
[stateful]: https://kubernetes.io/docs/tasks/run-application/run-replicated-stateful-application/
[stateless]: https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/
[storage]: ../storage
[user-workloads]: user-workloads
