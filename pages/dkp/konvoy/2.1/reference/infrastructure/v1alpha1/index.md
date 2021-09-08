---
layout: layout.pug
navigationTitle: v1alpha1
title: infrastructure.cluster.konvoy.d2iq.io/v1alpha1
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Review detailed Konvoy API reference information
---

> This document is automatically generated from the API definition in the code.

## Table of Contents

- [InventoryHost](#inventoryhost)
- [PreprovisionedInventory](#preprovisionedinventory)
- [PreprovisionedInventoryList](#preprovisionedinventorylist)
- [PreprovisionedInventoryReference](#preprovisionedinventoryreference)
- [PreprovisionedInventorySpec](#preprovisionedinventoryspec)
- [SSHConfig](#sshconfig)

## InventoryHost

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| address | The Address of the host to ssh with | string | false |

[Back to TOC](#table-of-contents)

## PreprovisionedInventory

PreprovisionedInventory is the Schema for the preprovisionedinventories API

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [PreprovisionedInventorySpec](#preprovisionedinventoryspec) | false |
| status |  | [PreprovisionedInventoryStatus](#preprovisionedinventorystatus) | false |

[Back to TOC](#table-of-contents)

## PreprovisionedInventoryList

PreprovisionedInventoryList contains a list of PreprovisionedInventory

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][PreprovisionedInventory](#preprovisionedinventory) | true |

[Back to TOC](#table-of-contents)

## PreprovisionedInventoryReference

PreprovisionedInventoryReference represents a PreprovisionedInventory Reference. It has enough information to retrieve secret in any namespace

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| name | Name is unique within a namespace to reference a secret resource. | string | false |
| namespace | Namespace defines the space within which the secret name must be unique. | string | false |

[Back to TOC](#table-of-contents)

## PreprovisionedInventorySpec

PreprovisionedInventorySpec defines the desired state of PreprovisionedInventory

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| hosts |  | [][InventoryHost](#inventoryhost) | true |
| sshConfig | SSHConfig specifies everything needed to ssh to a host | [SSHConfig](#sshconfig) | true |

[Back to TOC](#table-of-contents)

## PreprovisionedInventoryStatus

PreprovisionedInventoryStatus defines the observed state of PreprovisionedInventory

## SSHConfig

SSHConfig specifies everything needed to ssh to a host

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| port | The port used to SSH to the machine | int | true |
| user | The user used to SSH to the machine | string | true |
| privateKeyRef | The Secret with the private key used to SSH to the machine | corev1.SecretReference | true |

[Back to TOC](#table-of-contents)
