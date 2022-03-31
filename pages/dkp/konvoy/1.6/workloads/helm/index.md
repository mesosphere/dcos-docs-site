---
layout: layout.pug
navigationTitle: Helm
title: Helm
menuWeight: 5
excerpt: Deployment Helm Workloads
beta: false
enterprise: false
---

Helm is a package manager for Kubernetes that defines:

- A way to structure workloads in a package called [Charts][charts]
- A way to host and search for charts called [Repositories][repositories]
- A mechanism to version charts
- A template and custom [values][values] for an installation of a chart
- A command-line tool `helm` that helps manage workloads in your cluster
- and [much more][helm-docs]

## Before you begin

- All the rules for getting started with workloads apply
- [Install helm][helm-install]

## Get started with Helm

With helm installed, you will need to know the chart you are looking to install. This means knowing a repository to search or pull it from. There are 2 options to help you get started.

1. [https://artifacthub.io/][artifact-hub] is a repository for helm charts and operators.
1. [https://charts.helm.sh/stable/][helm-stable-repo] is the official Helm stable repository.

For a simple nginx workload, [search on artifacthub.io][artifact-nginx] shows a number of results with the top result being from ORG: Bitnami and REPO: Bitnami. Selecting that option shows a [detailed page][artifact-nginx-detail] which includes how to install and uninstall this chart. The details on the page include the following which can be used to install nginx.

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-release bitnami/nginx
```

The phrase `my-release` is the name of the service which this workload will be known. For this example, it can be confirmed by executing:

```bash
kubectl get deploy
```

```sh
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
my-release   1/1     1            1           57s
```

or you can use helm

```bash
helm ls
```

```sh
NAME        NAMESPACE   REVISION    UPDATED                                 STATUS      CHART          APP VERSION
my-release  default     1           2020-10-06 15:12:44.917119 -0500 CDT    deployed    nginx-7.1.3    1.19.3
```

### Helm values

One of the great features of helm is the ability to have variables in the chart allowing for customization at installation. This enables the ability to set values by using the `--set` flag as part of the install command or by providing a value file using the `-f` flag. Consulting the artifacthub page for nginx, it indicates that `replicaCount` is a deployment parameter with a default of 1. Let's set that value to 2.

```bash
helm install --set replicaCount=2 my-release bitnami/nginx

## if you run into issues installing you may change the name "my-release" or uninstall the original deployment
helm delete my-release
## yes it is possible to update values as well
```

### Charts in development

### Working with Charts in Development

It is useful to know that you do not need to get charts from a repository. You can install from the file system if you prefer. To do so, specify the folder location as the final argument to `helm install`. For example:

```bash
helm install --set replicaCount=2 my-release bitnami/nginx ./nginx
```

## Notes on Helm

Helm is a popular and powerful tool in deploying workloads to Kubernetes. Be aware of the following items:

- Helm and Helm charts do NOT provide ordered deployments or reconciliation features. It provides parameterized manifest files that are versioned together. There are a number of charts which have [stateful workloads](..) which are much better handled through a [Kubernetes controller or operator][operators].
- Helm charts have varying degrees of maturity. Some are well engineered and some are not. It is important to investigate in order to understand the level of maturity available.
- Many Helm charts are duplicated which causes confusion. For example, a search for [Kafka on artifacthub][artifact-kafka] yields 3 versions in 3 distinct repositories. In addition, the search results include `kafka-operator` or Strimzi (another Kafka operator) which provide similar features in a Kubernetes operator.
- Helm can be a deployment mechanism for Kubernetes controllers and operators. If you want to use Helm for stateful workloads, D2iQ strongly recommends you use an operator.

## Related information

For information on related topics or procedures, refer to the following:

- [Official Helm Documentation][helm-docs]

[artifact-hub]: https://artifacthub.io/
[artifact-kafka]: https://artifacthub.io/packages/search?page=1&ts_query_web=kafka
[artifact-nginx]: https://artifacthub.io/packages/search?page=1&ts_query_web=nginx
[artifact-nginx-detail]: https://artifacthub.io/packages/helm/bitnami/nginx
[charts]: https://helm.sh/docs/topics/charts/
[helm-docs]: https://helm.sh/docs/
[helm-install]: https://helm.sh/docs/intro/install/
[helm-stable-repo]: https://charts.helm.sh/stable/
[operators]: ../operators
[repositories]: https://helm.sh/docs/topics/chart_repository/
[values]: https://helm.sh/docs/chart_template_guide/values_files/
