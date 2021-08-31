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

- [PreprovisionedMachineTemplate](#preprovisionedmachinetemplate)
- [PreprovisionedMachineTemplateList](#preprovisionedmachinetemplatelist)
- [PreprovisionedMachineTemplateResource](#preprovisionedmachinetemplateresource)
- [PreprovisionedMachineTemplateSpec](#preprovisionedmachinetemplatespec)
- [PreprovisionedMachine](#preprovisionedmachine)
- [PreprovisionedMachineList](#preprovisionedmachinelist)
- [PreprovisionedMachineSpec](#preprovisionedmachinespec)
- [PreprovisionedMachineStatus](#preprovisionedmachinestatus)
- [InventoryHost](#inventoryhost)
- [PreprovisionedInventory](#preprovisionedinventory)
- [PreprovisionedInventoryList](#preprovisionedinventorylist)
- [PreprovisionedInventoryReference](#preprovisionedinventoryreference)
- [PreprovisionedInventorySpec](#preprovisionedinventoryspec)
- [SSHConfig](#sshconfig)
- [PreprovisionedCluster](#preprovisionedcluster)
- [PreprovisionedClusterList](#preprovisionedclusterlist)
- [PreprovisionedClusterSpec](#preprovisionedclusterspec)
- [PreprovisionedClusterStatus](#preprovisionedclusterstatus)
- [VirtualIP](#virtualip)

## PreprovisionedMachineTemplate

PreprovisionedMachineTemplate is the Schema for the preprovisionedmachinetemplates API

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [PreprovisionedMachineTemplateSpec](#preprovisionedmachinetemplatespec) | false |

[Back to TOC](#table-of-contents)

## PreprovisionedMachineTemplateList

PreprovisionedMachineTemplateList contains a list of PreprovisionedMachineTemplate

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][PreprovisionedMachineTemplate](#preprovisionedmachinetemplate) | true |

[Back to TOC](#table-of-contents)

## PreprovisionedMachineTemplateResource

PreprovisionedMachineTemplateResource describes the data needed to create a PreprovisionedMachine from a template.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| spec | Spec is the specification of the desired behavior of the machine. | [PreprovisionedMachineSpec](#preprovisionedmachinespec) | true |

[Back to TOC](#table-of-contents)

## PreprovisionedMachineTemplateSpec

PreprovisionedMachineTemplateSpec defines the desired state of PreprovisionedMachineTemplate

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| template |  | [PreprovisionedMachineTemplateResource](#preprovisionedmachinetemplateresource) | true |

[Back to TOC](#table-of-contents)

## PreprovisionedMachine

PreprovisionedMachine is the Schema for the preprovisionedmachines API

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [PreprovisionedMachineSpec](#preprovisionedmachinespec) | false |
| status |  | [PreprovisionedMachineStatus](#preprovisionedmachinestatus) | false |

[Back to TOC](#table-of-contents)

## PreprovisionedMachineList

PreprovisionedMachineList contains a list of PreprovisionedMachine

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][PreprovisionedMachine](#preprovisionedmachine) | true |

[Back to TOC](#table-of-contents)

## PreprovisionedMachineSpec

PreprovisionedMachineSpec defines the desired state of PreprovisionedMachine

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| providerID | ProviderID will be a unique name in ProviderID format (preprovisioned:////<ip>) | string | false |
| inventoryRef | InventoryRef is a reference to a resource that holds the details for the list of hosts. | [PreprovisionedInventoryReference](#preprovisionedinventoryreference) | true |
| address | The IP or hostname used to SSH to the machine | string | false |
| bootstrapped | Bootstrapped is true when the kubeadm bootstrapping has been run against this machine | bool | false |

[Back to TOC](#table-of-contents)

## PreprovisionedMachineStatus

PreprovisionedMachineStatus defines the observed state of PreprovisionedMachine

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| ready | Ready is true when the provider resource is ready. | bool | true |
| conditions | Conditions defines current service state of the PreprovisionedMachine. | clusterv1.Conditions | false |

[Back to TOC](#table-of-contents)

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

## PreprovisionedCluster

PreprovisionedCluster is the Schema for the preprovisionedclusters API

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [PreprovisionedClusterSpec](#preprovisionedclusterspec) | false |
| status |  | [PreprovisionedClusterStatus](#preprovisionedclusterstatus) | false |

[Back to TOC](#table-of-contents)

## PreprovisionedClusterList

PreprovisionedClusterList contains a list of PreprovisionedCluster

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][PreprovisionedCluster](#preprovisionedcluster) | true |

[Back to TOC](#table-of-contents)

## PreprovisionedClusterSpec

PreprovisionedClusterSpec defines the desired state of PreprovisionedCluster

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| controlPlaneEndpoint | ControlPlaneEndpoint represents the endpoint used to communicate with the control plane. | clusterv1.APIEndpoint | true |
| virtualIP | VirtualIP represents the configuration of the built-in virtual IP. | [VirtualIP](#virtualip) | false |

[Back to TOC](#table-of-contents)

## PreprovisionedClusterStatus

PreprovisionedClusterStatus defines the observed state of PreprovisionedCluster

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| ready | Ready is true when the provider resource is ready. | bool | true |
| conditions | Conditions defines current service state of the PreprovisionedMachine. | clusterv1.Conditions | false |

[Back to TOC](#table-of-contents)

## VirtualIP

VirtualIP represents the configuration of the built-in virtual IP.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| interface | Interface identifies the network interface on which keepalived creates a virtual IP. If virtual IP is enabled, the interface must not be empty. No default is provided. This interface must be defined on every control plane machine. | string | true |

[Back to TOC](#table-of-contents)
