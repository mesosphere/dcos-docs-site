---
layout: layout.pug
beta: false
navigationTitle: Projects
title: Projects
menuWeight: 8
excerpt: Multi-cluster Configuration Management
---

# Projects overview

Federation, in this context, means that a common configuration is pushed out from a central location (Kommander) to all Kubernetes clusters, or a pre-defined subset group under Kommander management. That pre-defined subset group of Kubernetes clusters is called a Project.

Projects provide central IT and business units the following benefits:

- Consistent deployment of configurations and services to clusters. 
- Sharing of Kubernetes clusters among several teams. 
- Access to Kubernetes Cluster Federation (KubeFed) from Kommander to coordinate the configuration of multiple Kubernetes clusters.

Kommander allows a user to manually or dynamically (using labels) select the Kubernetes clusters associated with a Project.
Projects support the management of configmaps, continuous deployments, secrets, services, quotas, and role-based access control by leveraging federated resources.

## Project Namespace

A Project Namespace is the grouping of all the individual standard Kubernetes namespaces that make up the concept of a Project Namespace. Project Namespaces isolate configurations across clusters. Individual standard Kubernetes namespaces are automatically created on all clusters belonging to the project. When creating a new project, you can customize the Kubernetes namespace name that is created. A Project Namespace is a Kommander specific concept.

## Create a Project

When you create a Project, you must specify a Project Name, a Namespace Name (optional) and a way for Kommander to determine which Kubernetes clusters are part of this project.

A Project Namespace corresponds to a Kubernetes Federated Namespace. By default, the name of the namespace is auto-generated based on the project name (first 57 characters) plus 5 unique alphanumeric characters. You can specify a namespace name, but you must ensure it does not conflict with any existing namespace on the target Kubernetes clusters that will be a part of the Project.

To determine which Kubernetes clusters will be part of this project, you can either manually select existing clusters, or define labels that Kommander will use to dynamically add clusters. The latter is recommended because it allows you to deploy additional Kubernetes clusters later and have them automatically associated with Projects based on their labels.

To create a Project, you can use the Kommander UI or create a Project object on the Kubernetes cluster where Kommander is running using kubectl or the Kubernetes API. Using the latter method you can configure Kommander resources in a declarative way.

## Create a Project - UI Method
Here is an example of what it looks like to create a project using the Kommander UI:

![Create Project](/dkp/kommander/1.4/img/create-project-form.png)


## Create a Project - Declarative YAML Object Method

The following sample is a YAML Kubernetes object for creating a Kommander Project. Use this as an example, filling in your specific workspace name and namespace name appropriately along with the proper labels. This example does not work as is because it uses a workspace name that does not exist in your cluster. 

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

The following procedures are supported for projects:

- [Manage Project ConfigMaps](/dkp/kommander/1.4/projects/project-configmaps)
- [Manage Project Continuous Deployments](/dkp/kommander/1.4/projects/project-deployments)
- [Deploy Platform Services](/dkp/kommander/1.4/projects/platform-services)
- [Manage Project Policies](/dkp/kommander/1.4/projects/project-policies)
- [Manage Project Quotas](/dkp/kommander/1.4/projects/project-quotas-limit-range)
- [Manage Project Roles](/dkp/kommander/1.4/projects/project-roles)
- [Manage Project Secrets](/dkp/kommander/1.4/projects/project-secrets)
