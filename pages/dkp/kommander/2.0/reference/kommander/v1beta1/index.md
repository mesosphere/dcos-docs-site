---
layout: layout.pug
navigationTitle: v1beta1
title: kommander.mesosphere.io/v1beta1
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: Review detailed Kommander API reference information
---

> This document is automatically generated from the API definition in the code.

## Table of Contents

- [VirtualGroupClusterRoleBinding](#virtualgroupclusterrolebinding)
- [VirtualGroupClusterRoleBindingList](#virtualgroupclusterrolebindinglist)
- [VirtualGroupClusterRoleBindingSpec](#virtualgroupclusterrolebindingspec)
- [VirtualGroup](#virtualgroup)
- [VirtualGroupList](#virtualgrouplist)
- [VirtualGroupSpec](#virtualgroupspec)
- [License](#license)
- [LicenseCondition](#licensecondition)
- [LicenseList](#licenselist)
- [LicenseSpec](#licensespec)
- [LicenseStatus](#licensestatus)
- [KommanderCluster](#kommandercluster)
- [KommanderClusterCondition](#kommanderclustercondition)
- [KommanderClusterList](#kommanderclusterlist)
- [KommanderClusterSpec](#kommanderclusterspec)
- [KommanderClusterStatus](#kommanderclusterstatus)

## VirtualGroupClusterRoleBinding

VirtualGroupClusterRoleBinding is the Schema for the virtualgroupclusterrolebindings API.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [VirtualGroupClusterRoleBindingSpec](#virtualgroupclusterrolebindingspec) | true |

[Back to TOC](#table-of-contents)

## VirtualGroupClusterRoleBindingList

VirtualGroupClusterRoleBindingList contains a list of VirtualGroupClusterRoleBinding.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][VirtualGroupClusterRoleBinding](#virtualgroupclusterrolebinding) | true |

[Back to TOC](#table-of-contents)

## VirtualGroupClusterRoleBindingSpec

VirtualGroupClusterRoleBindingSpec defines the desired state of VirtualGroupClusterRoleBinding.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| clusterRoleRef |  | corev1.LocalObjectReference | true |
| virtualGroupRef |  | corev1.LocalObjectReference | true |
| placement |  | PlacementSelector | false |

[Back to TOC](#table-of-contents)

## VirtualGroup

VirtualGroup is the Schema for the virtualgroups API.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [VirtualGroupSpec](#virtualgroupspec) | false |

[Back to TOC](#table-of-contents)

## VirtualGroupList

VirtualGroupList contains a list of VirtualGroup.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][VirtualGroup](#virtualgroup) | true |

[Back to TOC](#table-of-contents)

## VirtualGroupSpec

VirtualGroupSpec defines the desired state of VirtualGroup.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| subjects |  | []rbacv1.Subject | false |

[Back to TOC](#table-of-contents)

## License

License is the Schema for the licenses API.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [LicenseSpec](#licensespec) | false |
| status |  | [LicenseStatus](#licensestatus) | false |

[Back to TOC](#table-of-contents)

## LicenseCondition

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| type |  | LicenseConditionType | true |
| status |  | metav1.ConditionStatus | true |
| reason |  | string | false |
| message |  | string | false |
| lastTransitionTime |  | metav1.Time | false |

[Back to TOC](#table-of-contents)

## LicenseList

LicenseList contains a list of License.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][License](#license) | true |

[Back to TOC](#table-of-contents)

## LicenseSpec

LicenseSpec defines the desired state of License.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| licenseRef | LicenseReference holds a single reference to the secret holding the license JWT | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## LicenseStatus

LicenseStatus defines the observed state of License.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| valid | Indicates whether the license is valid, i.e. the secret containing the JWT exists and the JWT carries a valid D2iQ signature. This does NOT indicate whether the license has expired or terms have been breached. | bool | true |
| customerId | The customer's ID. This is the customer name provided from Salesforce. | string | true |
| licenseId | The license's ID as provided from Salesforce. | string | true |
| startDate | Start date of the licensing period. | metav1.Time | false |
| endDate | End date of the licensing period. | metav1.Time | false |
| clusterCapacity | Maximum number of clusters that the license allows. | int32 | true |
| version | The license's version ID as provided when the license was created. | string | true |
| conditions | Conditions relevant to the license (currently used to track term breaches) | [][LicenseCondition](#licensecondition) | false |

[Back to TOC](#table-of-contents)

## KommanderCluster

KommanderCluster is the Schema for the kommander clusters API.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#objectmeta-v1-meta) | false |
| spec |  | [KommanderClusterSpec](#kommanderclusterspec) | false |
| status |  | [KommanderClusterStatus](#kommanderclusterstatus) | false |

[Back to TOC](#table-of-contents)

## KommanderClusterCondition

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| type |  | KommanderClusterConditionType | true |
| status |  | metav1.ConditionStatus | true |
| reason |  | string | false |
| message |  | string | false |
| lastTransitionTime |  | metav1.Time | false |

[Back to TOC](#table-of-contents)

## KommanderClusterList

KommanderClusterList contains a list of Cluster.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-21.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.21/#listmeta-v1-meta) | false |
| items |  | [][KommanderCluster](#kommandercluster) | true |

[Back to TOC](#table-of-contents)

## KommanderClusterSpec

KommanderClusterSpec defines the desired state of Cluster.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| kubeconfigRef |  | corev1.LocalObjectReference | false |
| clusterTunnelConnectorRef | ClusterTunnelConnectorRef is a reference to TunnelConnector that should be used for connecting to cluster. | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## KommanderClusterStatus

KommanderClusterStatus defines the observed state of Cluster.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| phase | Phase represents the current phase of cluster actuation. E.g. Pending, Provisioning, Provisioned, Deleting, Failed, etc. | KommanderClusterPhase | false |
| type | ClusterType represents the type of the cluster. E.g. EKS, GKE, etc. | KommanderClusterType | false |
| kubefedclusterRef | KubefedClusterRef holds a reference to a kubefedcluster in the kubefed system namespace. | corev1.LocalObjectReference | false |
| dextfaclientRef | DexTFAClientRef holds a reference to a DexClient provisioned for Traefik Forward Auth running on managed cluster. | corev1.ObjectReference | false |
| serviceEndpoints | ServiceEndpoints will be the addresses assigned to the Kubernetes exposed services | map[string]string | false |
| clusterId | KubernetesClusterID is the stable cluster ID of the Kubernetes cluster that this Kommander cluster represents. | string | false |
| kubernetesVersion | KubernetesVersion is the Kubernetes version of the cluster. | string | false |
| conditions |  | [][KommanderClusterCondition](#kommanderclustercondition) | false |

[Back to TOC](#table-of-contents)
