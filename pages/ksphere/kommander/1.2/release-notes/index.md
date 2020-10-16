---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 0
excerpt: View release-specific information for Kommander
enterprise: false
---

<!-- markdownlint-disable MD034 -->

# Release notes for Kommander 1.2

Kommander 1.2 was released on ??, October 2020 

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Konvoy[/button]

To get started with Kommander, [download](https://docs.d2iq.com/ksphere/konvoy/latest/download/) and [install](https://docs.d2iq.com/ksphere/konvoy/latest/install/) the latest version of Konvoy.

**NOTE:** You must be a registered user and logged on to the support portal to download this product. New customers must contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download or install Konvoy.</p>

# Release Summary 

Kommander provides a command center for all your cloud native management needs in public Information as a Service (IaaS), on-premises, and edge environments. Kommander provides a multi-tenant experience to create, secure, and configure Kubernetes clusters and cloud native workloads. Additionally, Kommander enables teams to unlock federated and cost management, across multiple clusters, whether they are a new Konvoy cluster or existing 3rd party/DIY distribution.

# Supported Versions

| Kubernetes Support | Version |
| ------------------ | ------- |
| **Minimum**        | 1.15.0  |
| **Maximum**        | 1.17.x  |
| **Default**        | 1.17.3  |

# New Features and Capabilities 


## Support for air-gapped environments

## Improved catalog handling

## Improved Access Control for editing/deleting actions 

## Changed routing from hash-based to history-based to allow redirects after login

GUI wizard to add customer repos 
Conductor integration (e.g. LHS menu) 
Catalog support for Helm repos 
Kommander demo env 
Support network tunnels
app template  
DKP product licensing 
Show Correct Addon Status 
Network Policy 
Limit ranger 
Kubefed scaling 
Create EKS/etc clusters 
Easy import process for 3rd party clusters

* Added SAML IDP
* Moved provisioning code to Konvoy, Kommander now uses Konvoy to provision clusters
* Added a setting to configure thresholds for resource warnings 
* Attaches EKS clusters now can show metrics
* Added Infrastructure provider management on global level

## Component versions
- Addon: `1.2.0-19`
- Chart: `0.11.15`
- kommaner-federation (yakcl): `0.5.1`
- kommander-licensing (yakcl): `0.5.1`
- UI: `6.37.0`
- kommander-karma: `0.3.10`
- kubeaddons-catalog: `0.1.14`
- kommander-thanos: `0.1.15`
- kubecost: `0.1.15`
- grafana: `4.6.3`

## Fixed and Improved Issues 

- Fixed an issue where logout was not deleting any cookies.
* Fixed UI crashes when kubecost was down
* Fixed catalog API occasionaly returned 500
* Fixed deleting cluster labels was impossible
* Fixed counting self-attached host cluster against license count
* Smaller UX Bugs and Improvements
* Smaller UX Bugs and Improvements
