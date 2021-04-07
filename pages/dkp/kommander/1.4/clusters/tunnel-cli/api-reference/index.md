---
layout: layout.pug
navigationTitle: API documentation (v1alpha1)
title: API documentation (v1alpha1)
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: API documentation (v1alpha1)
---

# API Documentation (v1alpha1)

> This document is automatically generated from the API definition in the code.

## Table of Contents
* [TunnelGateway](#tunnelgateway)
* [TunnelGatewayIngressSpec](#tunnelgatewayingressspec)
* [TunnelGatewayList](#tunnelgatewaylist)
* [TunnelGatewaySpec](#tunnelgatewayspec)
* [KubeconfigWebhookStatus](#kubeconfigwebhookstatus)
* [TunnelAgentStatus](#tunnelagentstatus)
* [TunnelConnector](#tunnelconnector)
* [TunnelConnectorList](#tunnelconnectorlist)
* [TunnelConnectorSpec](#tunnelconnectorspec)
* [TunnelConnectorStatus](#tunnelconnectorstatus)
* [TunnelServerStatus](#tunnelserverstatus)

## TunnelGateway

Describes how various services (e.g., tunnel server) will be exposed outside the current cluster.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-20.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#objectmeta-v1-meta) | false |
| spec |  | [TunnelGatewaySpec](#tunnelgatewayspec) | false |

[Back to TOC](#table-of-contents)

## TunnelGatewayIngressSpec



| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| loadBalancer | Ingress points for the load-balancer. Traffic intended for the service should be sent to these ingress points. If not specified, the controller will try to derive that from the Ingress record status field. | corev1.LoadBalancerIngress | false |
| host | Host in the Ingress record. | string | false |
| urlPathPrefix | URL path prefix to be append to all Ingresses. For example, if this field is set to \"/ops/portal/kt\", the ingresses created will have URL paths like the following:\n  \"/ops/portal/kt/default/cluster1/tunnel-server\"\n  \"/ops/portal/kt/default/cluster1/kubeconfig\"\nIf not specified, default to root path (i.e., \"/\"). | string | false |
| caSecretRef | A secret reference to the root CA that will be used to validate the ingress endpoints. The secret should have type \"Opaque\" and contain the key \"tls.crt\". If not specified, the default host root CA will be used to validate the endpoints. | corev1.ObjectReference | false |
| extraAnnotations | Extra annotations to set on the Ingress object. | map[string]string | false |

[Back to TOC](#table-of-contents)

## TunnelGatewayList

Contains a list of `TunnelGateway`.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-20.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#listmeta-v1-meta) | false |
| items |  | [][TunnelGateway](#tunnelgateway) | true |

[Back to TOC](#table-of-contents)

## TunnelGatewaySpec



| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| ingress | If specified, services will be exposed using Ingress. | [TunnelGatewayIngressSpec](#tunnelgatewayingressspec) | false |

[Back to TOC](#table-of-contents)

## KubeconfigWebhookStatus

Statuses about the kubeconfig webhook.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| deploymentRef | A reference to the deployment for the kubeconfig webhook. | corev1.LocalObjectReference | false |
| serviceRef | A reference to the service for the kubeconfig webhook. | corev1.LocalObjectReference | false |
| ingressRef | A reference to the ingress for the kubeconfig webhook. | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## TunnelAgentStatus

Statuses about the tunnel agent.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| manifestsRef | A reference to the secret holding the yaml file that contains the manifests for launching the tunnel agent in the target cluster. The secret is a generic typed secret with filenames as the keys. There might be multiple files in the secret. | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## TunnelConnector

Describes an intention to create a tunnel between the current cluster and the target cluster. This would allow the current cluster to access the target cluster through the tunnel  (assuming that the current cluster does not have direct access to the target cluster).

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-20.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#objectmeta-v1-meta) | false |
| spec |  | [TunnelConnectorSpec](#tunnelconnectorspec) | false |
| status |  | [TunnelConnectorStatus](#tunnelconnectorstatus) | false |

[Back to TOC](#table-of-contents)

## TunnelConnectorList

Contains a list of `TunnelConnector`.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ListMeta](https://v1-20.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#listmeta-v1-meta) | false |
| items |  | [][TunnelConnector](#tunnelconnector) | true |

[Back to TOC](#table-of-contents)

## TunnelConnectorSpec



| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| gatewayRef | A reference to the `TunnelGateway` object which describes how various services would be exposed outside the current cluster. | corev1.LocalObjectReference | false |
| proxyPort | The port for the tunnel proxy. | int32 | false |

[Back to TOC](#table-of-contents)

## TunnelConnectorStatus



| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| state | State of the tunnel connector - Starting: the default initial state - Listening: the tunnel server is listening and waiting for the agent to connect - Pending: the tunnel agent is available, but we do not yet have a proxy address to check for status - Connected: the tunnel is configured and we were able to contact the remote API server - Disconnected: the tunnel is configured but we were not able to contact the API server - Failed: an unexpected error occurred, such as the kubeconfig being unparseable | TunnelConnectorState | false |
| tunnelServer | Statuses about the tunnel server. | [TunnelServerStatus](#tunnelserverstatus) | false |
| kubeconfigWebhook | Statuses about the kubeconfig webhook. | [KubeconfigWebhookStatus](#kubeconfigwebhookstatus) | false |
| tunnelAgent | Statuses about the tunnel agent. | [TunnelAgentStatus](#tunnelagentstatus) | false |
| serviceAccountRef | A reference to the service account that will be used for registration (of the tunnel agent) and authentication purpose. | corev1.LocalObjectReference | false |
| roleRef | A reference to the role that will be bound to the service account for authorization purpose. | corev1.LocalObjectReference | false |
| roleBindingRef | A reference to the rolebinding that will be created to bind the service account and the role. | corev1.LocalObjectReference | false |
| kubeconfigRef | A reference to the secret holding the KUBECONFIG that the clients can use to talk to the API server of the target cluster when it becomes available. | corev1.LocalObjectReference | false |
| gatewayObservedGeneration | The generation of the linked TunnelGateway object associated with this object. Everytime the linked TunnelGateway object is updated, a controller will update this status field which will in turn trigger a reconciliation of this object. | int64 | false |

[Back to TOC](#table-of-contents)

## TunnelServerStatus

Statuses about the tunnel server.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| deploymentRef | A reference to the deployment for the tunnel server. | corev1.LocalObjectReference | false |
| serviceRef | A reference to the service for the tunnel server. | corev1.LocalObjectReference | false |
| ingressRef | A reference to the ingress for the tunnel server. | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)
