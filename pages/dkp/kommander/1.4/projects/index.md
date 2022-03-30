---
layout: layout.pug
beta: false
navigationTitle: Projects
title: Projects
menuWeight: 8
excerpt: Multi-cluster Configuration Management
---

# Projects overview

Federation, in this context, means that a central location (Kommander) hosts and pushes common configurations to all Kubernetes clusters, or a pre-defined subset group under Kommander management. That pre-defined subset group of Kubernetes clusters is called a **Project**.

**Projects** provide central IT and business units the following benefits:

- Deploying consistent configurations and services to clusters. 
- Sharing Kubernetes clusters among several teams. 
- Coordinating access to Kubernetes Cluster Federation (KubeFed) from Kommander for multiple clusters.

Kommander allows you to manually or dynamically (using labels) select the Kubernetes clusters associated with a project.
**Projects** support configmaps management, continuous deployments, secrets, services, quotas, and role-based access control by leveraging federated resources.

## Projects namespace

A Project namespace is a Kommander specific concept that groups all the individual standard Kubernetes namespaces and creates a Project Namespace. Project Namespaces isolate configurations across clusters. Individual standard Kubernetes namespaces are automatically created on all clusters belonging to the project. When creating a new project, you can customize the Kubernetes namespace name that is created.

## Create a project

Create a Project by specifying:
- A Project Name
- A Namespace Name (optional) 
- A way for Kommander to determine which Kubernetes clusters are part of this project

A Project Namespace corresponds to a Kubernetes Federated Namespace. By default, the name of the namespace is automatically generated based on the project name (first 57 characters) plus 5 unique alphanumeric characters. You can specify a namespace name, but you must ensure it does not conflict with any existing namespace on the target Kubernetes clusters that will be a part of the Project.

To determine which Kubernetes clusters will be part of this project, you can either manually select existing clusters, or define labels that Kommander will use to dynamically add clusters. The latter is recommended because it allows you to deploy additional Kubernetes clusters later and have them automatically associated with Projects based on their labels.

To create a Project, you can use the Kommander UI or create a Project object on the Kubernetes cluster where Kommander is running using kubectl or the Kubernetes API. Using the latter method you can configure Kommander resources in a declarative way.

## Create a project - UI method
Here is an example of what it looks like to create a project using the Kommander UI:

![Create Project](/dkp/kommander/1.4/img/create-project-form.png)


## Create a project - declarative YAML object method

The following sample is a YAML Kubernetes object for creating a Kommander Project. Use this as an example, filling in your specific workspace name and namespace name appropriately along with the proper labels. 
**Note:** This example will not work as-is because it uses a workspace name that does not exist in your cluster. 

```yaml
apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
kind: Project
metadata:
  name: My-Project-Name
  namespace: my-project-k8s-namespace-name
spec:
  workspaceRef:
    name: myworkspacename
  namespaceName: myworkspacename-di3tx
  placement:
    clusterSelector:
      matchLabels:
        cluster: prod
```
# Federation on selected clusters

You may want to limit the list of clusters receiving resources, such as a service or a quota to a subset of clusters in a particular Project. Use the federated resources' `spec.placement` field in this case. The following two examples show how set up either a list of clusters or a list of labels that a particular cluster must match.

## Provide a list of clusters

The following example demonstrates how the Jenkins service in the Project namespace *p1-hjmx8* is pinned to a single cluster called *ci*: 

```yaml
apiVersion: types.kubefed.io/v1beta2
kind: FederatedAddon
metadata:
  annotations:
    kommander.mesosphere.io/display-name: jenkins
  name: jenkins
  namespace: p1-hjmx8
spec:
  placement:
    clusters:
    - name: ci
  template:
[...]
```

## Provide a list of matching labels

The following example demonstrates how the Jenkins service in the Project namespace `p1-hjmx8` is pinned to all clusters that have the `ci: true` label:

```yaml
apiVersion: types.kubefed.io/v1beta2
kind: FederatedAddon
metadata:
  annotations:
    kommander.mesosphere.io/display-name: jenkins
  name: jenkins
  namespace: p1-hjmx8
spec:
  placement:
    clusterSelector:
      matchLabels:
        ci: "true"
  template:
[...]
```

The labels provided in the `matchLabels` field are matched against the `KubefedCluster` resource on the Kommander cluster.
Run:

```bash
kubectl get kubefedclusters -A
```

to find a list of all attached clusters and set the labels on each targeted cluster accordingly.

For more information on the placement of federated resources, see the [kubefed user documentation](https://github.com/kubernetes-sigs/kubefed/blob/master/docs/userguide.md#using-cluster-selector).
