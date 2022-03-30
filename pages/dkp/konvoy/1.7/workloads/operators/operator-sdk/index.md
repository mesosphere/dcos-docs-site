---
layout: layout.pug
navigationTitle: Operator SDK
title: Operator SDK
menuWeight: 8
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

## Operator SDK

[Operator SDK][operator-sdk] is a popular way to create a Kubernetes [operator][operator]. The [Operator Hub][operator-hub] is the official repository to find operators built using Operator SDK.

## Before you Begin
To run an SDK Operator workload beyond the standard workload prerequisites, you will need:

- [Operator Lifecycle Manager (OLM)][olm] service running in the cluster

The details for its installation are part of the install instructions when searching on [Operator Hub][operator-hub].

## Run an SDK Operator Workload

[CockroachDB][cockroach] is used as an example. Search Operator Hub for "cockroach db" results in the operators [detail page][cockroach-operator]. Pressing the "Install" button reveals the installation instructions which include the [OLM][olm] instructions. Only one OLM is needed for a cluster. The details provided are as follows:

Installation of OLM

```bash
curl -sL https://github.com/operator-framework/operator-lifecycle-manager/releases/download/0.16.1/install.sh | bash -s 0.16.1
```

Installation of the Operator

```bash
kubectl create -f https://operatorhub.io/install/cockroachdb.yaml
```

Some of the SDK Operators are based on [Helm][helm]. This allows for the configuration of operator configuration values using helm values files. Details are provided on the operator landing page. [CockroachDB Operator page][cockroach-operator] provides an example.

[cockroach]: https://github.com/cockroachdb/cockroach
[cockroach-operator]: https://operatorhub.io/operator/cockroachdb
[helm]: ../../helm
[olm]: https://sdk.operatorframework.io/docs/olm-integration/
[operator]: ..
[operator-sdk]: https://sdk.operatorframework.io/
[operator-hub]: https://operatorhub.io/
