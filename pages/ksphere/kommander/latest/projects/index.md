---
layout: layout.pug
navigationTitle: Projects
title: Projects
menuWeight: 8
excerpt: Multi-cluster Configuration Management
---

Projects empower teams to deploy their configurations and services to clusters in a consistent way. Kommander creates a unique namespace for each managed cluster. Using cluster labels to identify target clusters, Kommander relays project configuration, such as applications, secrets, and role-based authorization to dedicated namespaces on managed clusters.

## Project Namespace

Namespaces provides isolation for configuration across clusters and are created on all clusters matching the project labels. When creating a new project, you'll have the opportunity to customize the Kubernetes namespace that will be created alongside it.

![Creating a Project](/ksphere/kommander/img/project-create.png)

## Clusters

A project carries label selectors which are used to identify targets for configuration, ultimately allowing you to manage the configuration for arbitrary sets of clusters. For example, if your project includes the label selector `team: finance`, all project assets (listed below) will be relayed to all clusters bearing that label. Only clusters bearing _all_ the label selectors will be configured by the project.

When creating a project, you will see the matching clusters as you enter label selectors.

![Creating a Project](/ksphere/kommander/img/project-create-labels.png)

## Roles

Projects enable centralized managed access control by allowing you to define distributed roles that grant access to resources on all clusters. When creating a role, you specific lists of resources and actions that can be taken on them. Once created, they can be used by a Policy, which binds the role to a group.

## Policies

Policies are distributed to all clusters selected by a project and grant access to a specified role to a specified group.

<p class="message--warning"><strong>WARNING: </strong>
Changing cluster / project labels which lead to deselection which will cause the roles to be removed from the deselected clusters again.
</p>

## Configuration

In Kommander you can configure ConfigMaps and Secrets for your projects. 

### ConfigMaps & Secrets

Project ConfigMaps and Project Secrets allow you to define those configuration resources once and have them distributed to all project clusters.

![Creating a Secret](/ksphere/kommander/img/project-secret-create.png)

## Platform Services

Platform Services provide a catalog of applications that can be deployed across all project clusters.
