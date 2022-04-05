---
layout: layout.pug
navigationTitle: DKP Enterprise
title: DKP Enterprise
excerpt: A section containing all of the features available to users with a DKP Enterprise license.
menuWeight: 5
beta: false
---

## DKP Enterprise overview

![DKP Enterprise Diagram](/dkp/kommander/2.2/img/dkpenterprisediagramv2.png)

DKP Enterprise is a multi-cluster lifecycle management Kubernetes solution centered around a management cluster that manages multiple attached or managed Kubernetes clusters via a centralized management dashboard. The management dashboard gives you a single point of observability and control throughout all of your attached or managed clusters. The DKP Enterprise license gives the user access to the entire Konvoy cluster environment, the DKP UI dashboard that deploys platform and catalog applications, and multi-cluster management, and comprehensive compatibility with our full range of infrastructure deployment options.

## Compatible infrastructure

DKP Enterprise operates across D2iQ's entire range of cloud, on-premise, edge, and air-gapped infrastructures and has support for various OSs, including immutable OSs. See [Supported Operating Systems][supported] for a full list of compatible infrastructure.

For the basics on standing up a DKP Enterprise cluster in one of the listed environments of your choice, see [Choose Infrastructure][choose-infrastructure].  

## Platform applications

Applications can be deployed in any DKP managed clusters, giving you complete flexibility to operate across cloud, on-premise, edge, and air-gapped scenarios. DKP Enterprise users can use the DKP UI to customize which platform applications to deploy to the cluster in a given workspace.

## Catalog Applications

Quickly and easily deploy applications and complex data services from a centralized service catalog to specific or multiple clusters, with governance. Fast data pipelines can be provisioned automatically from the following catalog of DKP Applications:

- **Kafka:** Primarily used to build real-time streaming data pipelines and applications that adapt to the data streams. It combines messaging, storage, and stream processing to allow storage and analysis of both historical and real-time data.
- **Spark:** An industry standard analytics engine for big data processing and machine learning. Spark enables you to process data for both batch and streaming workloads.
- **Zookeeper:** A centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services.

 For instructions on how to deploy catalog applications, see [Workspace Catalog Applications][workspacecatapps]

## Cluster manager

Konvoy is the Kubernetes installer component of DKP Enterprise that uses industry standard tools to produce a certified Kubernetes cluster. These industry standard tools create a cluster management system that includes:

- **Control Plane:** Manages the worker nodes and pods in the cluster.
- **Worker Nodes:** Used to run containerized applications and handle networking to ensure that traffic between applications across the cluster and from outside of the cluster can be properly facilitated.
- **Container Networking Interface (CNI):** Calico's open source networking and network security solution for containers, virtual machines, and native host-based workloads.
- **Container Storage Interface (CSI):** A common abstraction to container orchestrators for interacting with storage subsystems of various types.
- **Kubernetes Cluster API (CAPI):** Cluster API uses Kubernetes-style APIs and patterns to automate cluster lifecycle management for platform operators. For more on how CAPI is integrated into DKP Enterprise, see [Understanding CAPI Concepts and Terms][capi-concepts-and-terms]
- **Cert Manager:** A Kubernetes addon to automate the management and issuance of TLS certificates from various issuing sources.
- **Cluster Autoscaler:** A component that automatically adjusts the size of a Kubernetes cluster so that all pods have a place to run and there are no unneeded nodes.

## Built-in GitOps

DKP Enterprise comes bundled with GitOps, an operating model for Kubernetes and other cloud native technologies, providing a set of best practices that unify Git deployment, management and monitoring for containerized clusters and applications. GitOps works by using Git as a single source of truth for declarative infrastructure and applications. With GitOps, the use of software agents can alert on any divergence between Git with what is running in a cluster, and if there's a difference, Kubernetes reconcilers automatically update or rollback the cluster depending on the case.

## DKP Enterprise multi-cluster UI

Bundled with DKP Enterprise is a multi-cluster management view of DKP UI that can be used in lieu of the bundled CLI. From the UI you can:

- **Connect to an infrastructure provider:** DKP Enterprise supports on-premises and cloud infrastructure providers such as AWS and Azure for your Konvoy clusters. To automate their provisioning, DKP requires authentication keys to your preferred infrastructure provider entered on the Add Infrastructure Provider form.
- **Setup identity providers:** DKP Enterprise supports GitHub, LDAP, SAML, and standard OIDC identity providers such as Google. These identity management providers support the login and authentication process for your Kubernetes cluster. See [Identity Providers][identityprov] for more information.
- **Configure access control:** Role-based authorization control (RBAC) is central to DKP Enterprise and controls access to resources on all connected clusters. The resources are similar to Kubernetes RBAC. You add an identity provider group, and in that group add cluster roles and cluster role bindings for those roles.
- **Deploy applications:** The DKP Enterprise UI allows you to customize your workspace application deployments via the Applications page within the UI.
- **Create a project:** Create projects within a workspace and deploy project-scoped applications. Projects enable teams to deploy configurations and services to their clusters consistently. After configuring roles, ConfigMaps, secrets, and applications for a project, DKP distributes this configuration to each project namespace. For more information concerning projects, see [Projects][projects].
- **Add a license:** To add a license via the UI, see [Add a license to Kommander][addlicense]
- **Kubernetes cost monitoring and management**: The kubecost platform application provides real-time cost visibility and insights for external cloud services such as AWS, helping you continuously reduce your cloud costs.

For more information concerning the global and workspace-level UI, see [Workspaces][workspaces]

[addlicense]: ../add/
[capi-concepts-and-terms]: /dkp/konvoy/2.1/major-version-upgrade/capi-concepts-and-terms/
[choose-infrastructure]: /dkp/konvoy/2.2/choose-infrastructure/
[dkpenterprise]: ../enterprise/
[identityprov]: ../../operations/identity-providers/
[projects]: ../../projects/
[supported]: /dkp/konvoy/2.2/supported-operating-systems/
[workspacecatapps]: ../../workspaces/applications/catalog-applications/
[workspaceplatform]: ../../workspaces/applications/platform-applications/
[workspaces]: ../../workspaces/
