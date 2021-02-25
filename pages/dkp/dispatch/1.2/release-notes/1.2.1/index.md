---
layout: layout.pug
navigationTitle: 1.2.1
title: Release Notes 1.2.1
menuWeight: 20
excerpt: View release-specific information for Dispatch 1.2.1
---

# Release Notes

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Dispatch [/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and signed on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Dispatch.</p>

## v1.2.1 - Released June 26, 2020
Document Modified Date: June 26, 2020

This document describes the new features, caveats, and resolved issues of D2iQ Dispatch.

### Installation and Upgrades

To install Dispatch, follow one of the two options below:
- **Installation**: Run `konvoy init` and then update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml`. 

- **Upgrade**: Update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml` .

1. Update the following *example* snippet from `cluster.yaml` to upgrade from Dispatch v1.1.0 to 1.2.0.

```yaml
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.16-1.2.0
    addonsList:
    - name: dispatch
      enabled: false
```

It should read:

```yaml
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.16-1.2.1
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
|Starlark | 0.6 |
|CUE | 0.4 |
|YAML | 0.3 |
|JSON | 0.3 |

### Improvements since v1.2.0

### Caveats

### Resolved Issues

* Fixed a bug where the garbage collector only reclaims resources in the last watched namespace.
* Fixed a bug where login commands should ignore existing `basic-auth` secrets on a service account if it has a different annotation type. For example, `login github` should ignore `login docker`'s secrets as they have different annotations.
