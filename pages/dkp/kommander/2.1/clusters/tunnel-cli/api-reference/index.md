---
layout: layout.pug
navigationTitle: API documentation (v1alpha1)
title: API documentation (v1alpha1)
menuWeight: 10
notes: Automatically generated, DO NOT EDIT
enterprise: false
excerpt: API documentation (v1alpha1)
---

<!-- markdownlint-disable MD030 -->

## API Documentation (v1alpha1)

> This document is automatically generated from the API definition in the code.

## Table of Contents

- [TunnelGateway](#tunnelgateway)

- [TunnelGatewayIngressSpec](#tunnelgatewayingressspec)

- [TunnelGatewayList](#tunnelgatewaylist)

- [TunnelGatewaySpec](#tunnelgatewayspec)

- [KubeconfigWebhookStatus](#kubeconfigwebhookstatus)

- [TunnelAgentStatus](#tunnelagentstatus)

- [TunnelConnector](#tunnelconnector)

- [TunnelConnectorList](#tunnelconnectorlist)

- [TunnelConnectorSpec](#tunnelconnectorspec)

- [TunnelConnectorStatus](#tunnelconnectorstatus)

- [TunnelServerStatus](#tunnelserverstatus)

## TunnelGateway

Provides an endpoint for remote clusters to connect to the management cluster.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| metadata |  | [metav1.ObjectMeta](https://v1-20.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#objectmeta-v1-meta) | false |
| spec |  | [TunnelGatewaySpec](#tunnelgatewayspec) | false |

[Back to TOC](#table-of-contents)

## TunnelGatewayIngressSpec

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| loadBalancer | Ingress point for the load-balancer. Traffic intended for the service should be sent to these ingress points. If not specified, the controller will derive from the Ingress record status field. | corev1.LoadBalancerIngress | false |
| host | Restrict access to requests addressed to a specific host or domain using the [`IngressRule` format](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#ingressrule-v1beta1-networking-k8s-io). Defaults to allow all hosts. | string | false |
| urlPathPrefix | URL path prefix to prepend to all endpoints. For example, if this field is set to `/ops/portal/kt`, the ingresses created will have URL paths like `/ops/portal/kt/default/cluster1/tunnel-server` and `/ops/portal/kt/default/cluster1/kubeconfig`. Defaults to root path (`/`). | string | false |
| caSecretRef | A secret reference to the root CA required to verify the ingress endpoints. The secret should have type `Opaque` and contain the key `ca.crt`. If not specified, remote hosts will use their system root CA's to verify the endpoints. | corev1.ObjectReference | false |
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

If no ingress is set, the services will only be accessible on `localhost`.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| ingress | Expose services using an Ingress as specified in the `TunnelGatewayIngressSpec`. | [TunnelGatewayIngressSpec](#tunnelgatewayingressspec) | false |

[Back to TOC](#table-of-contents)

## KubeconfigWebhookStatus

Status of the kubeconfig webhook.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| deploymentRef | A reference to the deployment for the kubeconfig webhook. | corev1.LocalObjectReference | false |
| serviceRef | A reference to the service for the kubeconfig webhook. | corev1.LocalObjectReference | false |
| ingressRef | A reference to the ingress for the kubeconfig webhook. | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## TunnelAgentStatus

Status of the tunnel agent.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| manifestsRef | A reference to a secret holding YAML manifests for launching the tunnel agent on the target cluster. The secret is a generic typed secret with filenames as the keys. There might be multiple files in the secret. | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)

## TunnelConnector

Describes the local endpoint for the tunnel. A remote cluster will connect to this endpoint to create a tunnel.

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
| gatewayRef | A reference to the `TunnelGateway` object which describes how tunnel services will be exposed outside the current cluster. | corev1.LocalObjectReference | false |
| proxyPort | The port for the tunnel proxy. | int32 | false |

[Back to TOC](#table-of-contents)

## TunnelConnectorStatus

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| state | State of the tunnel connector: `Starting` - the initial state; `Listening` - the local tunnel server is waiting for the remote agent to connect; `Pending` - the remote agent has connected but the local proxy is not ready; `Connected` - the tunnel is configured and contact to the remote API server succeeded; `Disconnected` - the tunnel is configured but contact to the remote API server failed; `Failed` - an unexpected error occurred, such as not being able to parse the kubeconfig. | TunnelConnectorState | false |
| tunnelServer | Status of the tunnel server. | [TunnelServerStatus](#tunnelserverstatus) | false |
| kubeconfigWebhook | Status of the kubeconfig webhook. | [KubeconfigWebhookStatus](#kubeconfigwebhookstatus) | false |
| tunnelAgent | Status of the tunnel agent. | [TunnelAgentStatus](#tunnelagentstatus) | false |
| serviceAccountRef | A reference to the service account that will be used for registration (of the tunnel agent) and authentication purpose. | corev1.LocalObjectReference | false |
| roleRef | A reference to the role that will be bound to the service account for authorization purpose. | corev1.LocalObjectReference | false |
| roleBindingRef | A reference to the rolebinding that will be created to bind the service account and the role. | corev1.LocalObjectReference | false |
| kubeconfigRef | A reference to the secret holding the KUBECONFIG that the clients can use to talk to the API server of the target cluster when it becomes available. | corev1.LocalObjectReference | false |
| gatewayObservedGeneration | The generation of the linked TunnelGateway object associated with this object. When the linked TunnelGateway object is updated, a controller will update this status field which will in turn trigger a reconciliation of this object. | int64 | false |

[Back to TOC](#table-of-contents)

## TunnelServerStatus

Status of the tunnel server.

| Field | Description | Scheme | Required |
| ----- | ----------- | ------ | -------- |
| deploymentRef | A reference to the deployment for the tunnel server. | corev1.LocalObjectReference | false |
| serviceRef | A reference to the service for the tunnel server. | corev1.LocalObjectReference | false |
| ingressRef | A reference to the ingress for the tunnel server. | corev1.LocalObjectReference | false |

[Back to TOC](#table-of-contents)
