---
layout: layout.pug
navigationTitle: Projects
title: Projects
menuWeight: 8
excerpt: Multi-cluster Configuration Management
---

Projects empower teams to deploy their configurations and services to clusters in a consistent way. Kommander creates a unique namespace for each managed cluster. Using cluster labels to identify target clusters, Kommander relays project configuration, such as applications, secrets, and role-based authorization to dedicated namespaces on managed clusters.

## Project Namespace

Namespaces isolate configurations across clusters and are created on all clusters matching the project labels. When creating a new project, you can customize the Kubernetes namespace that is also created.

![Creating a Project](/ksphere/kommander/img/project-create.png)

## Clusters

A project contains label selectors that identify targets for configuration, allowing you to manage configurations for arbitrary cluster sets. For example, if your project includes the label selector `team: finance`, all project assets are relayed to clusters having that label. Only clusters having _all_ the label selectors are configured by the project.

When creating a project, you see the matching clusters as you enter label selectors.

![Creating a Project](/ksphere/kommander/img/project-create-labels.png)

## Roles

Projects enable centralized managed access control by defining distributed roles. These roles grant access to resources on all clusters. When creating a role, you specify lists of resources and actions that can be taken. After they are created, they can be used by a Policy, that binds the role to a group.

## Policies

Policies are distributed to all clusters, selected by a project, and grant access to a specified role for a specified group.

## Configuration

In Kommander you can configure ConfigMaps and Secrets for your projects.

### ConfigMaps & Secrets

Using project ConfigMaps and project Secrets you can define configuration resources to distribute to all project clusters.

![Creating a Secret](/ksphere/kommander/img/project-secret-create.png)

## Platform Services

Platform Services provide a catalog of applications you can deploy across all project clusters. See [Addon Catalog](/ksphere/kommander/latest/projects/addon-catalog) for more information
