---
layout: layout.pug
navigationTitle: Glossary
title: Glossary
excerpt:
menuWeight: 10
---

# Cluster Types Guide

- **Attached** - not created with Kommander. Those clusters can’t be managed with kommander but just observed.
- **Managed** - created through Kommander. Cluster can be managed, scaled, and deleted.
- **Management** - the cluster that runs Kommander.


# Entities Guide

## Cluster

A Kubernetes Cluster Kommander is connected to, either created by or joined into Kommander.

## Project

Projects empower teams to deploy their configurations and services to clusters in a consistent way. Using **cluster labels** to identify target clusters, Kommander relays project configuration to dedicated namespaces on managed clusters. You can configure roles, secrets, and application services in the catalog for a Project, and Kommander will distribute that desired state to the project namespace.

## Access Control

### Group

### Role

### Policy

## Platform Service

## Cloud provider

## Identity Provide


# Cluster Statuses Guide

- **Active** - Cluster is available

- **Pending** - This is the initial state when a cluster is created or connected. It is not yet available and still needs to be setup to be active in Kommander.

- **Loading** - The cluster has been added to Kommander and we are fetching details about the cluster. This is the status before `Active`.

## Kommander cluster statuses

- **Joined**
- **JoinFailed** - This can happen when kubefed does not have permission to create entities in the host cluster.
- **Joining** - The join process is done, we wait for the first bit of data from the cluster to arrive
- **Unjoined**
- **UnjoinFailed**
- **Unjoining** - Kubefed cleans up after itself, removing all installed resources on the connected cluster

## Konvoy cluster statuses

- **Deleted**
- **Deleting**
- **Failed**
- **Provisioned**
- **Provisioning**
