---
layout: layout.pug
navigationTitle: Dispatch 1.4.0
title: Release Notes 1.4.0
menuWeight: 10
beta: false
excerpt: View release-specific information for Dispatch 1.4.0 
---

# Release Notes for Dispatch 1.4.0

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Dispatch [/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and signed on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Dispatch.</p>

## v1.4.0 - Released Feb 3, 2021
Document Modified Date: Released Feb 3, 2021

This document describes the new features, caveats, and resolved issues in D2iQ Dispatch. 

### Disclaimer

* Release notes are sometimes updated with new information about restrictions and caveats. Please see [https://docs.d2iq.com/dkp/dispatch/](https://docs.d2iq.com/dkp/dispatch/) for the latest version of the D2iQ Dispatch release-notes.

### FluxCD

This release introduces [FluxCD](https://toolkit.fluxcd.io/) as a new GitOps backend. ArgoCD is now considered deprecated and will likely be removed in future releases. [Refer to this guide to learn how to setup your GitOps repositories with FluxCD.](../../tutorials/cd_tutorials/fluxcd/)

### Installation and Upgrades

To install Dispatch, follow one of the two options below:
- **Installation**: Run `konvoy init` and then update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml`. 

- **Upgrade**: Update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml` .

1. Update the following *example* snippet from `cluster.yaml` to upgrade Dispatch 1.3.x to 1.4.0.

```yaml
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.16-1.4.0
    addonsList:
    - name: dispatch
      enabled: false
```

It should read:

```yaml
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.18-1.4.0
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

### Known Issues

- Prometheus endpoint `/ops/portal/prometheus/targets` will report target `dispatch/dispatch-event-sink-images/0` as unhealthy, with an error message `server returned HTTP status 404 Not Found`. Please run `kubectl delete servicemonitor -n dispatch dispatch-event-sink-images` to resolve this error.

### Improvements since Dispatch 1.3

- Added support to tasks for annotations and labels.
- Addes support in Dispatch CLI for Docker registry authentication when pulling images.
- Added support for automated installation of FluxCD onto federated clusters.
- Upgraded Tekton to v0.16.3. 

### Resolved Issues

- Fixed issue with buildkit deployment on multi-instance Dispatch deployments.


### Notes
