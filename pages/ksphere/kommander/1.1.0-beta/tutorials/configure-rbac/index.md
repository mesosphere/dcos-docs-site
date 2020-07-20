---
layout: layout.pug
navigationTitle: Granting access to Kubernetes resources in Kommander
title: Granting access to Kubernetes resources in Kommander
menuWeight: 1
excerpt: Configure role-based access control for Kubernetes resources in Kommander
---

## Before you begin

This procedure requires the following configurations and background: 
- A Konvoy cluster with [Kommander installed](https://docs.d2iq.com/ksphere/kommander/1.1/install/).
- An [Identity Provider](https://docs.d2iq.com/ksphere/kommander/1.1/tutorials/authorize-all-users/) has been created. 
- Some familiarity with [Kubernetes role-based access control](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) principles.
- 4 configured [groups](https://docs.d2iq.com/ksphere/kommander/1.0/operations/identity-providers/) in Kommander

## Create Role-Based Access Control Personas

Manage access to resources on Kubernetes clusters through the [RBAC API](https://kubernetes.io/docs/reference/access-authn-authz/rbac/). The base premise revolves around assigning users to groups, which are then associated with roles that control their level of access through role bindings.
This procedure describes how a cluster administrator can assign different levels of access to Kubernetes and Kommander resources in the Kommander UI.

Kommander has [three levels of access control](https://docs.d2iq.com/ksphere/kommander/1.1/operations/access-control/) to support global, workspace, and project use cases. Kommander creates default roles at all three levels to simplify the process of assigning users to different levels of access to resources.

In this procedure, using these default roles, you will create four different personas with users assigned to them:
- *Global admin*: these users can administer all Kubernetes and Kommander resources on the management cluster and all target clusters.
- *Global viewer*: these users have read-only viewing access to all Kubernetes and Kommander resources on the management cluster and all target clusters.
- *Workspace admin*: these users can administer the workspaces they have specifically been given access to.
- *Workspace viewer*: these users can access the workspaces they have specifically been given access to in a readonly capacity.

If you haven't done so already, create a group to represent each of the personas. For more details on groups, see the [Identity Providers page](https://docs.d2iq.com/ksphere/kommander/1.0/operations/identity-providers/) and the [Identity Provider tutorial](https://docs.d2iq.com/ksphere/kommander/1.1/tutorials/authorize-all-users/).

## Grant access to personas

You have already assigned users to groups that represent the four different personas. You must now modify resource access levels for each persona, and associate roles with the groups using policies.

### Global Admin persona

The *Global Admin* persona should have admin access to all resources on the management cluster as well as all target clusters in all workspaces. 

In the Kommander UI, do the following:
1. Select *Global* in the header drop-down. 
2. Select *Administration* > *Access Control*.
3. Select the *Cluster Roles* tab. 
There are several default roles created by Kommander. The two that will be used for this persona are:
  * *Cluster Admin Role*: because this is a Cluster Role type role, it applies to all target clusters in all workspaces.
  * *Kommander Global Admin Role*: because this is a Kommander Role type role, it applies to the management cluster.
4. Select the *Cluster Policies* tab and add these two roles to the *Global Admin* group.

You have now created role bindings that associate the Global Admin group with these two roles, which ensure that the users in the Global Admin group have admin access to the management cluster and all target clusters.

### Global Viewer persona

The *Global Viewer* persona should have read-only access to all resources on the management cluster and all target clusters. 

In the Kommander UI, do the following:
1. Select *Global* in the header drop-down. 
2. Select *Administration* > *Access Control*.
3. Select the *Cluster Roles* tab. 
There are several default roles created by Kommander. The two that will be used for this persona are:
  * *View Role*: because this is a Cluster Role type role, it applies to all target clusters in all workspaces.
  * *Global Kommander View Role*: because this is a Kommander Role type role, it applies to the management cluster.
Select the Cluster Policies tab and add these two roles to the *Global Viewer* group.

You have now created role bindings that associate the Global Viewer group with these two roles, which ensure that the users in the Global Viewer group have read-only access to the management cluster and all target clusters.

### Workspace Admin persona

The *Workspace Admin* persona should have admin access to the Default Workspace. This allows users to administrate all namespaced resources in the workspace namespace on the management cluster, as well as all cluster resources on the workspace’s target clusters.

In the Kommander UI, do the following:
1. Select *Global* in the header drop-down. 
2. Select *Administration* > *Access Control*.
3. Select the *Cluster Roles* tab.
The two default roles that will be used for this persona are:
  * *Workspace Admin Role*: because this is a Cluster Role type role, it applies to all target clusters in all workspaces
  * *Kommander Workspace Admin Role*: because this is a Kommander Role type role, it applies to the management cluster. This role grants admin access to the workspace namespace on the management cluster. When a policy is created with this role, a ClusterRole and policy will automatically be created at the global level to allow access to this workspace specifically, instead of all workspaces.
4. Select the Cluster Policies tab and assign these two roles to the *Workspace Admin* group.

### Workspace Viewer persona

The *Workspace Viewer* persona will grant users read-only access to the Default Workspace. This allows users to view all namespaced resources in the workspace namespace on the management cluster, as well as all cluster resources on the workspace’s target clusters.

In the Kommander UI, do the following:
1. Select *Global* in the header drop-down. 
2. Select *Administration* > *Access Control*.
3. Select the *Cluster Roles* tab.
The two default roles that will be used for this persona are:
  * *Workspace View Role*: because this is a Cluster Role type role, it applies to all target clusters in all workspaces
  * *Kommander Workspace View Role*: because this is a Kommander Role type role, it applies to the management cluster. This role grants read-only access to the workspace namespace on the management cluster. When a policy is created with this role, a ClusterRole and policy will automatically be created at the global level to allow access to this workspace specifically, instead of all workspaces.
4. Select the Cluster Policies tab and assign these two roles to the *Workspace Viewer* group.

### Custom personas

You were able to satisfy the access level of the four examples using the default roles provided by Kommander. The same process of creating a group with users to represent a persona, selecting roles that represent that persona’s level of access, and creating policies that bind roles to groups, can be extended to use any custom configured roles as well. 

## Related information

- [Installing and configuring Kommander](https://docs.d2iq.com/ksphere/kommander/1.1/install/)
- [Identity Providers in Kommander](https://docs.d2iq.com/ksphere/kommander/1.1/operations/identity-providers/)
- [Configuring a GitHub Identity Provider in Kommander](https://docs.d2iq.com/ksphere/kommander/1.1/tutorials/authorize-all-users/)
- [Granting access to Kubernetes resources in the CLI](https://docs.d2iq.com/ksphere/konvoy/1.4/security/external-idps/rbac/)
- [Access control in Kommander](https://docs.d2iq.com/ksphere/kommander/1.1/operations/access-control/)
- [Kubernetes RBAC authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
