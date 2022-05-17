---
layout: layout.pug
beta: false
navigationTitle: Release Notes Kommander 1.2.0
title: Release Notes Kommander 1.2.0
menuWeight: 10
excerpt: View release-specific information for Kommander 1.2.0
enterprise: false
---

<!-- markdownlint-disable MD034 -->

# Important changes
Docker Hub announced an update to their image pull policies in August, 2020. The change results in the need to change cluster configurations to accommodate new account structures that enable image pull rate limiting.

Rate limiting happens on a per-pull basis regardless of whether the pulled image is owned by a paid user. This means D2iQ, as owner of most images used in Konvoy, does not have any influence as to whether your current address is rate-limited or not. Konvoy does not have a strict dependency on Docker Hub accounts or plans.

For more information on addressing this limit, refer to this [procedure](../operations/manage-docker-hub-rate-limits).

# Release notes for Kommander 1.2

**D2iQ&reg; Kommander&reg; 1.2 was released on November 16, 2020** 

[button color="purple" href="https://support.d2iq.com/hc/en-us/articles/4409215222932-Product-Downloads"]Download Konvoy[/button]

To get started with Kommander, [download](/dkp/konvoy/1.6/download/) and [install](/dkp/konvoy/1.6/install/) the latest version of Konvoy.

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and logged on to the support portal to download this product. New customers must contact their sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary 
Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Additionally, Kommander enables teams to unlock federated cost management across multiple clusters, whether they are a new Konvoy cluster or an existing 3rd party/DIY distribution installation.

# New Features and Capabilities 

## Air gapped environments
Kommander now supports installing and running in an air gapped environment, either on premises or in the cloud. Air gapped environments are ideal when high-security is a must or when Internet connectivity is undesirable or unavailable. For information on setting up Kommander in an air gapped environment, see [Install Kommander air gapped](/ksphere/kommander/1.2/install-airgapped/).
## Component versions
- Addon: 1.2.0-36
- Chart: 0.12.16
- kommander-federation (yakcl): 0.6.9
- kommander-licensing (yakcl): 0.6.9
- UI: 6.37.0
- kommander-karma: 0.3.10
- kubeaddons-catalog: 0.1.15
- kommander-thanos: 0.1.15
- kubecost: 0.1.15
- grafana: 6.6.0
- karma: 0.70
- thanos: 0.10.1
- cost-analyzer: 1.67.1

## Fixed and Improved Issues 
- Improved Access Control for editing/deleting actions. 
- Changed routing from hash-based to history-based to allow redirects after login.
- Added SAML IDP.
- Moved provisioning code to Konvoy. Kommander now uses Konvoy to provision clusters.
- Added a setting to configure thresholds for resource warnings. 
- Added the ability to show metrics in attached EKS clusters.
- Added Infrastructure provider management on global level.
- Fixed an issue where logout was not deleting any cookies.
- Fixed UI crashes when kubecost was down.
- Fixed an issue where the catalog API occasionally returned 500.
- Fixed an issue that prevented deleting cluster labels.
- Fixed an issue that erroneously counted the self-attached host cluster against the license count.
- Updated cert-manager resources to v1.
- Added automatic creation of **KommanderProjectRole** and **VirtualGroupKommanderProjectRoleBinding** objects based on Workspace objects.
- Fixed access to kubecost UI for some cluster roles.
- Created the serviceaccount needed for deletion jobs on delete.
- Added --ignore-not-found to resource cleanup jobs to ignore errors if resource has already been deleted.
- Fixed metric collection for kubefed, kommander-federation, and kommander-licensing.
- Numerous UX bug fixes and improvements.

[install_airgapped](/dkp/kommander/1.2/install-airgapped/)
