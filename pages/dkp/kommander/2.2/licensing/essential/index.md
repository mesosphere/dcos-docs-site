---
layout: layout.pug
navigationTitle: DKP Essential
title: DKP Essential
excerpt: A section containing all of the features available to users with a DKP Essential license.
menuWeight: 5
beta: false
---

## DKP Essential overview

![DKP Essential Diagram](../img/dkpessentialdiagram.png)

DKP Essential is a FIPS-compliant, self-managed single cluster Kubernetes solution that gives you a feature-rich, easy-to-deploy, and easy-to-manage entry-level cloud container platform. The DKP Essential license gives the user access to the entire Konvoy cluster environment, as well as the Kommander platform application manager for standing up crucial day-2 level production.

## Compatible infrastructure

DKP Essential operates across a range of cloud, on-premise, edge, and air-gapped infrastructures and has support for various OSs, including immutable OSs.

Deployment options for DKP Essential include:

* Bare metal servers
* VMware vSphere   

Cloud deployment options for DKP Essential include:

* Amazon Web Services (AWS)
* Microsoft Azure
* Google Cloud Platform (GCP)

For the basics on standing up a DKP Essential cluster in one of the previously listed environments of your choice, see [Choose Infrastructure][choose-infrastructure].  

<p class="message--note"><strong> NOTE:</strong> Infrastructure options are dependent upon license type. Some infrastructure deployment options listed within the corresponding link above may not be available for DKP Essential users. For an expanded list of supported infrastructure, see <a href="https://docs.d2iq.com/dkp/kommander/2.2/licensing/enterprise/">DKP Enterprise</a>.</p>

## Platform applications

When creating a cluster, the application manager deploys certain platform applications on the newly created cluster. DKP Essential users can use the Kommander UI to customize which platform applications to deploy to the cluster in a given workspace. For a list of available platform applications that are included with DKP Essential, see [Workspace Platform Applications][workspaceplatform].

<p class="message--note"><strong>NOTE:</strong> The platform application <code>kubecost</code> is not included with DKP Essential, but is included with <a href="https://docs.d2iq.com/dkp/kommander/2.2/licensing/enterprise/">DKP Enterprise</a>.</p>

## Cluster manager

Konvoy is the Kubernetes installer component of DKP Essential that uses industry standard tools to produce a certified Kubernetes cluster. These industry standard tools create a cluster management system that includes:

* **Control Plane:** Manages the worker nodes and pods in the cluster.
* **Worker Nodes:** Used to run containerized applications and handle networking to ensure that traffic between applications across the cluster and from outside of the cluster can be properly facilitated.
* **Container Networking Interface (CNI):** Calico's open source networking and network security solution for containers, virtual machines, and native host-based workloads.
* **Container Storage Interface (CSI):** A common abstraction to container orchestrators for interacting with storage subsystems of various types.
* **Kubernetes Cluster API (CAPI):** Cluster API uses Kubernetes-style APIs and patterns to automate cluster lifecycle management for platform operators. For more on how CAPI is integrated into DKP Essential, see [Understanding CAPI Concepts and Terms][capi-concepts-and-terms]
* **Cert Manager:** A Kubernetes add-on to automate the management and issuance of TLS certificates from various issuing sources.
* **Cluster Autoscaler:** A component that automatically adjusts the size of a Kubernetes cluster so that all pods have a place to run and there are no unneeded nodes.

## Built-in GitOps

DKP Essential comes bundled with GitOps, an operating model for Kubernetes and other cloud native technologies, providing a set of best practices that unify Git deployment, management and monitoring for containerized clusters and applications. GitOps works by using Git as a single source of truth for declarative infrastructure and applications. With GitOps, the use of software agents can alert on any divergence between Git with what's running in a cluster, and if there's a difference, Kubernetes reconcilers automatically update or rollback the cluster depending on the case.

## DKP Essential single cluster UI

Bundled with DKP Essential is a single cluster management UI that can be used in lieu of the bundled CLI. From the UI you can:

* **Setup identity providers:** DKP Essential supports GitHub, LDAP, SAML, and standard OIDC identity providers such as Google. These identity management providers support the login and authentication process for your Kubernetes cluster. See [Identity Providers][identityprov] for more information.
* **Deploy applications:** The DKP Essential UI allows you to customize your workspace application deployments via the Applications page within the UI.
* **Add a license:** To add a license via the UI, see [Add a license to Kommander][addlicense]

For more information concerning the global and workspace-level UI, see [Workspaces][workspaces]

## FAQ

* I'm getting a denial message when I attempt to attach or manage clusters with my DKP Essential self-managed cluster, why?

DKP Essential only provides for the ability to stand up an individual, self-managed kubernetes cluster. Attaching or managing other clusters via a management cluster is only available by upgrading to [DKP Enterprise][dkpenterprise]

* I used to be able to work with one free attached cluster, and now I can't see it in the UI, why?

Prior to DKP version 2.2 you could create or attach 1 additional cluster without a license. If you have a 2.1 cluster that utilized that 1 additional cluster and upgrade to 2.2, the upgrade will automatically put you into the DKP Essential UI, and you will no longer have access to that additional cluster in the UI. However, the additional cluster will still appear within the CLI. To resolve this, enter your [DKP Enterprise][dkpenterprise] license in either the UI or CLI, and the previously attached cluster and deployed applications will reappear within the UI.

[choose-infrastructure]: .../konvoy/2.2/choose-infrastructure/
[workspaceplatform]: .../workspaces/applications/platform-applications/
[capi-concepts-and-terms]: .../konvoy/2.1/major-version-upgrade/capi-concepts-and-terms/
[addlicense]: .../add/
[workspaces]: .../workspaces/
[dkpenterprise]: .../enterprise/
