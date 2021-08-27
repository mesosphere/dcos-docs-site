---
layout: layout.pug
navigationTitle: v1alpha1
title: workspaces.kommander.mesosphere.io/v1alpha1
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Review detailed Kommander API reference information
---

> This document is automatically generated from the API definition in the code.

## Table of Contents

- [Workspace](#workspace)
- [WorkspaceCondition](#workspacecondition)
- [WorkspaceList](#workspacelist)
- [WorkspaceSpec](#workspacespec)
- [WorkspaceStatus](#workspacestatus)
- [WorkspaceRole](#workspacerole)
- [WorkspaceRoleList](#workspacerolelist)
- [WorkspaceRoleSpec](#workspacerolespec)
- [WorkspaceRoleStatus](#workspacerolestatus)
- [VirtualGroupWorkspaceRoleBinding](#virtualgroupworkspacerolebinding)
- [VirtualGroupWorkspaceRoleBindingList](#virtualgroupworkspacerolebindinglist)
- [VirtualGroupWorkspaceRoleBindingSpec](#virtualgroupworkspacerolebindingspec)
- [VirtualGroupWorkspaceRoleBindingStatus](#virtualgroupworkspacerolebindingstatus)
- [VirtualGroupProjectRoleBinding](#virtualgroupprojectrolebinding)
- [VirtualGroupProjectRoleBindingList](#virtualgroupprojectrolebindinglist)
- [VirtualGroupProjectRoleBindingSpec](#virtualgroupprojectrolebindingspec)
- [VirtualGroupProjectRoleBindingStatus](#virtualgroupprojectrolebindingstatus)
- [VirtualGroupKommanderWorkspaceRoleBinding](#virtualgroupkommanderworkspacerolebinding)
- [VirtualGroupKommanderWorkspaceRoleBindingList](#virtualgroupkommanderworkspacerolebindinglist)
- [VirtualGroupKommanderWorkspaceRoleBindingSpec](#virtualgroupkommanderworkspacerolebindingspec)
- [VirtualGroupKommanderWorkspaceRoleBindingStatus](#virtualgroupkommanderworkspacerolebindingstatus)
- [VirtualGroupKommanderProjectRoleBinding](#virtualgroupkommanderprojectrolebinding)
- [VirtualGroupKommanderProjectRoleBindingList](#virtualgroupkommanderprojectrolebindinglist)
- [VirtualGroupKommanderProjectRoleBindingSpec](#virtualgroupkommanderprojectrolebindingspec)
- [VirtualGroupKommanderProjectRoleBindingStatus](#virtualgroupkommanderprojectrolebindingstatus)
- [VirtualGroupKommanderClusterRoleBinding](#virtualgroupkommanderclusterrolebinding)
- [VirtualGroupKommanderClusterRoleBindingList](#virtualgroupkommanderclusterrolebindinglist)
- [VirtualGroupKommanderClusterRoleBindingSpec](#virtualgroupkommanderclusterrolebindingspec)
- [VirtualGroupKommanderClusterRoleBindingStatus](#virtualgroupkommanderclusterrolebindingstatus)
- [Project](#project)
- [ProjectCondition](#projectcondition)
- [ProjectList](#projectlist)
- [ProjectSpec](#projectspec)
- [ProjectStatus](#projectstatus)
- [ProjectRole](#projectrole)
- [ProjectRoleList](#projectrolelist)
- [ProjectRoleSpec](#projectrolespec)
- [ProjectRoleStatus](#projectrolestatus)
- [KommanderWorkspaceRole](#kommanderworkspacerole)
- [KommanderWorkspaceRoleList](#kommanderworkspacerolelist)
- [KommanderWorkspaceRoleSpec](#kommanderworkspacerolespec)
- [KommanderWorkspaceRoleStatus](#kommanderworkspacerolestatus)
- [KommanderProjectRole](#kommanderprojectrole)
- [KommanderProjectRoleList](#kommanderprojectrolelist)
- [KommanderProjectRoleSpec](#kommanderprojectrolespec)
- [KommanderProjectRoleStatus](#kommanderprojectrolestatus)

## Workspace

Workspace is the Schema for the workspaces API.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [WorkspaceSpec](#workspacespec) | false |
| status |  | [WorkspaceStatus](#workspacestatus) | false |

[Back to TOC](#table-of-contents)

## WorkspaceCondition

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| type | Type of workspace condition. | WorkspaceConditionType | true |
| status | Status of the condition, one of True, False, Unknown. | corev1.ConditionStatus | true |
| lastTransitionTime | Last time the condition transitioned from one status to another. | metav1.Time | false |
| reason | The reason for the condition's last transition. | string | false |
| message | A human readable message indicating details about the transition. | string | false |

[Back to TOC](#table-of-contents)

## WorkspaceList

WorkspaceList contains a list of Workspace.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][Workspace](#workspace) | true |

[Back to TOC](#table-of-contents)

## WorkspaceSpec

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| clusterLabels |  | map[string]string | false |
| namespaceName | NamespaceName specifies the optional namespace name to use for the workspace. This field is immutable, only settable on create. | string | false |

[Back to TOC](#table-of-contents)

## WorkspaceStatus

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| namespaceRef |  | corev1.LocalObjectReference | false |
| conditions | Represents the latest available observations of a workspace's current state. | [][WorkspaceCondition](#workspacecondition) | false |

[Back to TOC](#table-of-contents)

## WorkspaceRole

WorkspaceRole is the Schema for the workspaces API.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [WorkspaceRoleSpec](#workspacerolespec) | false |
| status |  | [WorkspaceRoleStatus](#workspacerolestatus) | false |

[Back to TOC](#table-of-contents)

## WorkspaceRoleList

WorkspaceRoleList contains a list of WorkspaceRole.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][WorkspaceRole](#workspacerole) | true |

[Back to TOC](#table-of-contents)

## WorkspaceRoleSpec

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| rules |  | []rbacv1.PolicyRule | false |
| aggregationRule |  | rbacv1.AggregationRule | false |

[Back to TOC](#table-of-contents)

## WorkspaceRoleStatus

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| federatedClusterRoleRef |  | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## VirtualGroupWorkspaceRoleBinding

VirtualGroupWorkspaceRoleBinding is the Schema for the VirtualGroupWorkspaceRoleBinding API.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [VirtualGroupWorkspaceRoleBindingSpec](#virtualgroupworkspacerolebindingspec) | true |
| status |  | [VirtualGroupWorkspaceRoleBindingStatus](#virtualgroupworkspacerolebindingstatus) | false |

[Back to TOC](#table-of-contents)

## VirtualGroupWorkspaceRoleBindingList

VirtualGroupWorkspaceRoleBindingList contains a list of VirtualGroupWorkspaceRoleBinding.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][VirtualGroupWorkspaceRoleBinding](#virtualgroupworkspacerolebinding) | true |

[Back to TOC](#table-of-contents)

## VirtualGroupWorkspaceRoleBindingSpec

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| workspaceRoleRef |  | corev1.LocalObjectReference | true |
| virtualGroupRef |  | corev1.LocalObjectReference | true |
| placement |  | v1beta1.PlacementSelector | false |

[Back to TOC](#table-of-contents)

## VirtualGroupWorkspaceRoleBindingStatus

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| federatedClusterRoleBindingRef |  | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## VirtualGroupProjectRoleBinding

VirtualGroupProjectRoleBinding is the Schema for the VirtualGroupProjectRoleBinding API.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [VirtualGroupProjectRoleBindingSpec](#virtualgroupprojectrolebindingspec) | true |
| status |  | [VirtualGroupProjectRoleBindingStatus](#virtualgroupprojectrolebindingstatus) | false |

[Back to TOC](#table-of-contents)

## VirtualGroupProjectRoleBindingList

VirtualGroupProjectRoleBindingList contains a list of VirtualGroupProjectRoleBinding.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][VirtualGroupProjectRoleBinding](#virtualgroupprojectrolebinding) | true |

[Back to TOC](#table-of-contents)

## VirtualGroupProjectRoleBindingSpec

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| workspaceRoleRef | WorkspaceRoleRef maybe a LocalObjectReference but the WorkspaceRole is not created in project namespace but in Workspace namespace. \"Local\" in LocalObjectReference means \"Local to project's workspace\" since there can only be one workspace the project is in. | corev1.LocalObjectReference | false |
| projectRoleRef |  | corev1.LocalObjectReference | false |
| virtualGroupRef |  | corev1.LocalObjectReference | true |

[Back to TOC](#table-of-contents)

## VirtualGroupProjectRoleBindingStatus

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| federatedRoleBindingRef |  | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## VirtualGroupKommanderWorkspaceRoleBinding

VirtualGroupKommanderWorkspaceRoleBinding is the Schema to be used in the API.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [VirtualGroupKommanderWorkspaceRoleBindingSpec](#virtualgroupkommanderworkspacerolebindingspec) | true |
| status |  | [VirtualGroupKommanderWorkspaceRoleBindingStatus](#virtualgroupkommanderworkspacerolebindingstatus) | false |

[Back to TOC](#table-of-contents)

## VirtualGroupKommanderWorkspaceRoleBindingList

VirtualGroupKommanderWorkspaceRoleBindingList contains a list of VirtualGroupKommanderWorkspaceRoleBinding.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][VirtualGroupKommanderWorkspaceRoleBinding](#virtualgroupkommanderworkspacerolebinding) | true |

[Back to TOC](#table-of-contents)

## VirtualGroupKommanderWorkspaceRoleBindingSpec

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| kommanderWorkspaceRoleRef |  | corev1.LocalObjectReference | true |
| virtualGroupRef |  | corev1.LocalObjectReference | true |

[Back to TOC](#table-of-contents)

## VirtualGroupKommanderWorkspaceRoleBindingStatus

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| roleBindingInWorkspaceRef |  | corev1.LocalObjectReference | false |
| clusterRoleBindingRef |  | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## VirtualGroupKommanderProjectRoleBinding

VirtualGroupKommanderProjectRoleBinding is the Schema to be used in the API.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [VirtualGroupKommanderProjectRoleBindingSpec](#virtualgroupkommanderprojectrolebindingspec) | true |
| status |  | [VirtualGroupKommanderProjectRoleBindingStatus](#virtualgroupkommanderprojectrolebindingstatus) | false |

[Back to TOC](#table-of-contents)

## VirtualGroupKommanderProjectRoleBindingList

VirtualGroupKommanderProjectRoleBindingList contains a list of VirtualGroupKommanderProjectRoleBinding.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][VirtualGroupKommanderProjectRoleBinding](#virtualgroupkommanderprojectrolebinding) | true |

[Back to TOC](#table-of-contents)

## VirtualGroupKommanderProjectRoleBindingSpec

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| kommanderProjectRoleRef |  | corev1.LocalObjectReference | true |
| virtualGroupRef |  | corev1.LocalObjectReference | true |

[Back to TOC](#table-of-contents)

## VirtualGroupKommanderProjectRoleBindingStatus

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| roleBindingInProjectRef |  | corev1.LocalObjectReference | false |
| roleBindingInWorkspaceRef |  | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## VirtualGroupKommanderClusterRoleBinding

VirtualGroupKommanderClusterRoleBinding is the Schema for the VirtualGroupWorkspaceRoleBinding API.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [VirtualGroupKommanderClusterRoleBindingSpec](#virtualgroupkommanderclusterrolebindingspec) | true |
| status |  | [VirtualGroupKommanderClusterRoleBindingStatus](#virtualgroupkommanderclusterrolebindingstatus) | false |

[Back to TOC](#table-of-contents)

## VirtualGroupKommanderClusterRoleBindingList

VirtualGroupKommanderClusterRoleBindingList contains a list of VirtualGroupKommanderClusterRoleBinding.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][VirtualGroupKommanderClusterRoleBinding](#virtualgroupkommanderclusterrolebinding) | true |

[Back to TOC](#table-of-contents)

## VirtualGroupKommanderClusterRoleBindingSpec

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| clusterRoleRef |  | corev1.LocalObjectReference | true |
| virtualGroupRef |  | corev1.LocalObjectReference | true |

[Back to TOC](#table-of-contents)

## VirtualGroupKommanderClusterRoleBindingStatus

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| clusterRoleBindingRef |  | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## Project

Project is a logical top-level container for a set of Kommander resources.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [ProjectSpec](#projectspec) | false |
| status |  | [ProjectStatus](#projectstatus) | false |

[Back to TOC](#table-of-contents)

## ProjectCondition

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| type | Type of project condition. | ProjectConditionType | true |
| status | Status of the condition, one of True, False, Unknown. | corev1.ConditionStatus | true |
| lastTransitionTime | Last time the condition transitioned from one status to another. | metav1.Time | false |
| reason | The reason for the condition's last transition. | string | false |
| message | A human readable message indicating details about the transition. | string | false |

[Back to TOC](#table-of-contents)

## ProjectList

ProjectList is a list of Project objects.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][Project](#project) | true |

[Back to TOC](#table-of-contents)

## ProjectSpec

ProjectSpec describes the attributes on a Project.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| workspaceRef |  | corev1.LocalObjectReference | false |
| placement |  | v1beta1.PlacementSelector | false |
| namespaceName | NamespaceName specifies the optional namespace name to use for the project. This field is immutable, only settable on create. | string | false |

[Back to TOC](#table-of-contents)

## ProjectStatus

ProjectStatus is information about the current status of a Project.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| namespaceRef |  | corev1.LocalObjectReference | false |
| conditions | Represents the latest available observations of a project's current state. | [][ProjectCondition](#projectcondition) | false |

[Back to TOC](#table-of-contents)

## ProjectRole

ProjectRole is the Schema for the workspaces ProjectRole API.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [ProjectRoleSpec](#projectrolespec) | false |
| status |  | [ProjectRoleStatus](#projectrolestatus) | false |

[Back to TOC](#table-of-contents)

## ProjectRoleList

ProjectRoleList contains a list of ProjectRole.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][ProjectRole](#projectrole) | true |

[Back to TOC](#table-of-contents)

## ProjectRoleSpec

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| rules |  | []rbacv1.PolicyRule | false |

[Back to TOC](#table-of-contents)

## ProjectRoleStatus

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| federatedRoleRef |  | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## KommanderWorkspaceRole

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [KommanderWorkspaceRoleSpec](#kommanderworkspacerolespec) | false |
| status |  | [KommanderWorkspaceRoleStatus](#kommanderworkspacerolestatus) | false |

[Back to TOC](#table-of-contents)

## KommanderWorkspaceRoleList

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][KommanderWorkspaceRole](#kommanderworkspacerole) | true |

[Back to TOC](#table-of-contents)

## KommanderWorkspaceRoleSpec

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| rules |  | []rbacv1.PolicyRule | false |
| workspaceObjectVerbs |  | []string | false |

[Back to TOC](#table-of-contents)

## KommanderWorkspaceRoleStatus

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| clusterRoleRef |  | corev1.LocalObjectReference | false |
| roleInWorkspaceRef |  | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## KommanderProjectRole

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [KommanderProjectRoleSpec](#kommanderprojectrolespec) | false |
| status |  | [KommanderProjectRoleStatus](#kommanderprojectrolestatus) | false |

[Back to TOC](#table-of-contents)

## KommanderProjectRoleList

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][KommanderProjectRole](#kommanderprojectrole) | true |

[Back to TOC](#table-of-contents)

## KommanderProjectRoleSpec

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| rules |  | []rbacv1.PolicyRule | false |
| projectObjectVerbs |  | []string | false |

[Back to TOC](#table-of-contents)

## KommanderProjectRoleStatus

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| roleInWorkspaceRef |  | corev1.LocalObjectReference | false |
| roleInProjectRef |  | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)
