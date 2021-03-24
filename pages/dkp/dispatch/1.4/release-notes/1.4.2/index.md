---
layout: layout.pug
navigationTitle: Dispatch 1.4.2
title: Release Notes 1.4.2
menuWeight: 10
beta: false
excerpt: View release-specific information for Dispatch 1.4.2
---

# Release Notes for Dispatch 1.4.2

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Dispatch [/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and signed on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Dispatch.</p>

## v1.4.2 - Released March 24, 2021
Document Modified Date: Released March 5, 2021

This document describes the new features, caveats, and resolved issues in D2iQ Dispatch.

### Disclaimer

* Release notes are sometimes updated with new information about restrictions and caveats. Please see [https://docs.d2iq.com/dkp/dispatch/](https://docs.d2iq.com/dkp/dispatch/) for the latest version of the D2iQ Dispatch release-notes.

### Installation and Upgrades

To install Dispatch, follow one of the two options below:
- **Installation**: Run `konvoy init` and then update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml`.

- **Upgrade**: Update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml` .

  1. Update the following *example* snippet from `cluster.yaml` to upgrade Dispatch 1.3.x to 1.4.2.

     ```yaml
       - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
         configVersion: stable-1.18-1.3.1
         addonsList:
         - name: dispatch
           enabled: false
     ```

     It should read:

     ```yaml
       - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
         configVersion: stable-1.19-1.4.2
         addonsList:
         - name: dispatch
           enabled: true
     ```

  2. Apply the configuration to install/upgrade Dispatch to the Konvoy cluster.
     ```
     konvoy up
     ```

  3. Verify that the installation/upgrade is successful.
     ```
     helm test dispatch-kubeaddons
     ```

### Frontend Languages

| Frontend Language | Version |
| ------------------ | ------- |
|Starlark | 0.9 |
|CUE | 0.7 |
|YAML | 0.6 |
|JSON | 0.6 |

### Improvements since v1.4.1

#### Resolved Issues

- Support self-signed certificates for ArgoCD login through Konvoy SSO.
