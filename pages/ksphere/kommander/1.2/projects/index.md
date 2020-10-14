---
layout: layout.pug
beta: true
navigationTitle: Projects
title: Projects
menuWeight: 8
excerpt: Multi-cluster Configuration Management
---

Projects empower teams to deploy their configurations and services to clusters in a consistent way. Projects allow central IT or a business unit to share their Kubernetes clusters among several teams.
Using Projects, Kommander is leveraging Kubernetes Cluster Federation (aka KubeFed) to coordinate the configuration of multiple Kubernetes clusters.
When a Project is created, Kommander creates a federated namespace that is propagated to the Kubernetes clusters associated with this Project.
Kommander allows a user to manually or dynamically (using labels) select the Kubernetes clusters associated with a Project.
Projects support the management of configmaps, secrets, services, quotas, and role-based access control by leveraging federated resources.

## Project Namespace

Namespaces isolate configurations across clusters and are created on all clusters matching the project labels. When creating a new project, you can customize the Kubernetes namespace that is also created.

## Creating a Project

When you create a Project, you must specify a Project Name, a Namespace Name (optional) and a way to allow Kommander to determine which Kubernetes clusters will be part of this project.

As mentioned above, a Project Namespace corresponds to a Kubernetes Federated Namespaces. By default, the name of the namespace will be auto-generated based on the project name (first 57 characters) plus 5 unique alphanumeric characters. You can also specify a namespace name, but in this case, you must make sure it won’t conflict with any existing namespace on the target Kubernetes clusters.

To determine which Kubernetes clusters will be part of this project, you can either select manually existing clusters or define labels that Kommander will use to dynamically add clusters. The latter is recommended because it will allow you to deploy additional Kubernetes clusters later and to have them automatically associated with Projects based on their labels.

To create a Project, you can either use the Kommander UI or create a Project object on the Kubernetes cluster where Kommander is running (using kubectl or the Kubernetes API). The latter allows you to configure Kommander resources in a declarative way. It’s available for all kinds of Kommander resources.


## Creating a Project - UI Method
Here is an example of what it looks like to create a project using the Kommander UI:

![Create Project](/ksphere/kommander/1.2/img/create-project-form.png)


## Creating a Project - Declarative YAML Object Method

The below is a sample YAML Kubernetes object for creating a Kommander Project. It is only an example and will not work verbatim since it depends on a workspace name that has been previously created (which will not exist by default in your cluster). Use this as an example format and fill in the workspace name and namespaceName appropriately along with the proper labels.

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


The following procedures are supported for projects:

- [Deploy Platform Services](/ksphere/kommander/1.2/projects/platform-services)
- [Manage Project Roles](/ksphere/kommander/1.2/projects/project-roles)
- [Manage Project Policies](/ksphere/kommander/1.2/projects/project-policies)
- [Manage Project ConfigMaps](/ksphere/kommander/1.2/projects/project-configmaps)
- [Manage Project Secrets](/ksphere/kommander/1.2/projects/project-secrets)
- [Manage Project Quotas](/ksphere/kommander/1.2/projects/project-quotas)
