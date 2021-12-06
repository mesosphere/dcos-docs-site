---
layout: layout.pug
navigationTitle: v1alpha2
title: apps.kommander.mesosphere.io/v1alpha2
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Review detailed Kommander API reference information
---

> This document is automatically generated from the API definition in the code.

## Table of Contents

- [App](#app)
- [AppDeployment](#appdeployment)
- [AppDeploymentList](#appdeploymentlist)
- [AppDeploymentSpec](#appdeploymentspec)
- [AppList](#applist)
- [ClusterApp](#clusterapp)
- [ClusterAppList](#clusterapplist)
- [CrossNamespaceGitRepositoryReference](#crossnamespacegitrepositoryreference)
- [GenericAppSpec](#genericappspec)
- [TypedLocalObjectReference](#typedlocalobjectreference)

## App

App is the Schema for a Service or Application in Kommander.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [GenericAppSpec](#genericappspec) | false |
| status |  | [AppStatus](#appstatus) | false |

[Back to TOC](#table-of-contents)

## AppDeployment

AppDeployment is the Schema for a concrete installation of a Service or Application in Kommander.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [AppDeploymentSpec](#appdeploymentspec) | false |
| status |  | [AppDeploymentStatus](#appdeploymentstatus) | false |

[Back to TOC](#table-of-contents)

## AppDeploymentList

AppDeploymentList contains a list of AppDeployments.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| items |  | [][AppDeployment](#appdeployment) | true |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |

[Back to TOC](#table-of-contents)

## AppDeploymentSpec

AppDeploymentSpec defines an instance of an Application.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| appRef | AppRef provides reference to a ClusterApp or App object. | [TypedLocalObjectReference](#typedlocalobjectreference) | true |
| configOverrides | ConfigOverrides allows a user to define a ConfigMap that contains configuration overrides | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## AppDeploymentStatus

AppDeploymentStatus defines the current state of the AppDeployment.

## AppList

AppList contains a list of Apps.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| items |  | [][App](#app) | true |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |

[Back to TOC](#table-of-contents)

## AppStatus

AppStatus defines the current state of an App.

## ClusterApp

ClusterApp is the Schema for a Service or Application in Kommander.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [GenericAppSpec](#genericappspec) | false |
| status |  | [ClusterAppStatus](#clusterappstatus) | false |

[Back to TOC](#table-of-contents)

## ClusterAppList

ClusterAppList contains a list of ClusterApps.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| items |  | [][ClusterApp](#clusterapp) | true |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |

[Back to TOC](#table-of-contents)

## ClusterAppStatus

ClusterAppStatus defines the current state of an App.

## CrossNamespaceGitRepositoryReference

CrossNamespaceGitRepositoryReference contains enough information to let you locate the typed referenced object at cluster level.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| apiVersion | API version of the referent | string | false |
| kind | Kind of the referent | string | true |
| name | Name of the referent | string | true |
| namespace | Namespace of the referent, defaults to the Kustomization namespace | string | false |

[Back to TOC](#table-of-contents)

## GenericAppSpec

GenericAppSpec defines the actual Application spec.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| appId | AppID specifies the name of the application/workload | string | true |
| gitRepositoryRef | GitRepository is reference to the Flux's GitRepository, which in turn describes Git repository where the service resides | [CrossNamespaceGitRepositoryReference](#crossnamespacegitrepositoryreference) | true |
| version | Version depicts the version of the service in the semantic versioning format. | string | true |

[Back to TOC](#table-of-contents)

## TypedLocalObjectReference

TypedLocalObjectReference contains enough information to let you locate the typed referenced object at cluster or local level.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| apiVersion | API version of the referent | string | false |
| kind | Kind of the referent | string | true |
| name | Name of the referent | string | true |

[Back to TOC](#table-of-contents)
