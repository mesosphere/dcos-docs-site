---
layout: layout.pug
navigationTitle: v1alpha2
title: dispatch.d2iq.io/v1alpha2
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Review detailed Kommander API reference information
---

> This document is automatically generated from the API definition in the code.

## Table of Contents

- [GitopsRepository](#gitopsrepository)
- [GitopsRepositoryList](#gitopsrepositorylist)
- [GitopsRepositorySpec](#gitopsrepositoryspec)
- [GitopsRolloutTemplate](#gitopsrollouttemplate)

## GitopsRepository

GitopsRepository represents an SCM repository that backs a gitops resource. A gitops resource can be a FluxCD HelmRelease or Kustomization resource.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [GitopsRepositorySpec](#gitopsrepositoryspec) | true |

[Back to TOC](#table-of-contents)

## GitopsRepositoryList

GitopsRepositoryList contains a list of Repository.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| items |  | [][GitopsRepository](#gitopsrepository) | true |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |

[Back to TOC](#table-of-contents)

## GitopsRepositorySpec

GitopsRepositorySpec defines the desired state of GitopsRepository.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| cloneUrl | URL to clone the repository from. | string | false |
| secret | Reference to the secret to use when interacting with the Git provider API. The secret should contain the following fields:\n  username: the username (if password is not a token).\n  password: the password or token (required). | string | false |
| template | Template of the gitops resource backing the repository. | [GitopsRolloutTemplate](#gitopsrollouttemplate) | false |

[Back to TOC](#table-of-contents)

## GitopsRolloutTemplate

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| path | Root path to fetch manifests from in the Git repository. | string | false |
| ref | The Git reference to checkout and monitor for changes, defaults to master branch. This field supersedes the \"revision\" field in v1alpha1 API and is a breaking change. | sourcectrlv1beta1.GitRepositoryRef | false |
| suspend | Whether to suspend periodic or webhook-notified sync. | bool | false |

[Back to TOC](#table-of-contents)
