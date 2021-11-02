---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.3.0
title: Release Notes Kommander 1.3.0
menuWeight: 10
excerpt: View release-specific information for Kommander 1.3.0
enterprise: false
---

**D2iQ&reg; Kommander&reg; version 1.3.0 was released on February 10, 2021.**

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/1.7/download/) and [install](/dkp/konvoy/1.7/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Additionally, Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

# Supported Versions
| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.17.0  |
| **Maximum**        | 1.19.x  |
| **Default**        | 1.19.7  |

# Known issues

In Kommander 1.3.2 and earlier versions, the Kubecost cost analyzer requests a PVC of size 0.2Gi by default. This can cause issues with provisioners requiring a minimum storage size of 1Gi. Upgrade to version 1.3.3 to resolve this issue. Refer [here](https://github.com/kubecost/docs/blob/master/storage.md) for more information. 

In Kommander 1.3, unless a default NetworkPolicy existed prior to upgrading to 1.3, a default NetworkPolicy is created that allows traffic originating only within your Projects namespace. Pods can not talk to Pods outside of that namespace. In some cases this can have an unpredictable and unwanted impact on your system.

An alternative is to create an `allow-all` NetworkPolicy for each project in each managed cluster. Refer to following steps:

1. Point kubectl to the managed cluster

1. Enter the following command:

   ``` shell
   cat <<EOF | kubectl apply -f -
     apiVersion: networking.k8s.io/v1
     kind: NetworkPolicy
     metadata:
       name: allow-all
       namespace: <namespace corresponding to the project>
    spec:
      ingress:
      - {}
      podSelector: {}
      policyTypes:
      - Ingress
    EOF
   ```

1. Repeat steps 1 & 2 for each project namespace and managed cluster.

# Breaking changes

## Docker hub rate limiting
Docker Hub announced an update to their image pull policies in August, 2020. The change results in the need to change cluster configurations to accommodate new account structures that enable image pull rate limiting.

Rate limiting happens on a per-pull basis regardless of whether the pulled image is owned by a paid user. This means D2iQ, as owner of most images used in Konvoy, does not have any influence as to whether your current address is rate-limited or not. Konvoy does not have a strict dependency on Docker Hub accounts or plans.

For more information on addressing this limit, see [Docker hub rate limits](../../operations/manage-docker-hub-rate-limits).

# New Features
<!-- ## KUDO Spark compatibility

Kommander 1.3 requires KUDO Spark 3.0 because Spark 2.4 does not support Kubernetes 1.18.
To continue using KUDO Spark Kommander 1.3 and above, upgrade to Spark 3.0.
For details on how to migrate workloads to Spark 3.0, consult the official [migration guides](https://spark.apache.org/releases/spark-release-3-0-0.html) for each relevant module.
-->
## Control and configure workspace platform services
Customers now have the ability to control and configure which platform services get installed into an attached cluster by workspace. In Kommander specific platform services can be federated to attached non-Konvoy clusters. In each workspace customers can specify which platform services are federated to the attached non-Konvoy clusters.

For more information, see [Workspace Platform Services](../../workspaces/workspace-platform-services/).

## Managed cluster multi-tenancy
Kommander now supports managing network policies across project clusters. Projects are created with a secure-by-default network policy and users needing more flexibility can edit or add more policies to tailor to their unique security needs.

For more information, see [Network Policies](../../projects/project-network-policies/).

## Continuous deployment using Dispatch on Kommander
Kommander now supports continuous deployments as part of projects. Teams can leverage GitOps best practices to deploy configurations from source repositories to managed clusters using Dispatch and FluxCD. You can also configure source repositories to be deployed across all managed clusters using GitOps best practices. Kommander uses Dispatch and FluxCD to enable continuous deployments as a standard feature of projects.

For more information, see [Continuous Deployments](../../projects/project-deployments/).

## Component versions
- Addon: 1.3.0-6
- Chart: 0.13.7
- kommander-federation (yakcl): 0.7.0
- kommander-licensing (yakcl): 0.7.0
- UI: 6.70.0
- kommander-karma: 0.3.12
- kubeaddons-catalog: 0.1.15
- kommander-thanos: 0.1.16
- kubecost: 0.1.15
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.10.1
- cost-analyzer: 1.70.1

## Fixed and Improved Issues
- Added Kubecost Prometheus health dashboards to Grafana.
- Added the ability to edit network policies.
- Fixed Limit Range memory.
- Numerous UX bug fixes and improvements.
