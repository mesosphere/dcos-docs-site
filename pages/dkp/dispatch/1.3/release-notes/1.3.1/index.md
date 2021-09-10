---
layout: layout.pug
navigationTitle: 1.3.1
title: Release Notes 1.3.1
menuWeight: 10
beta: false 
excerpt: View release-specific information for Dispatch 1.3.1 
---

<p class="message--warning"><strong>WARNING: </strong>D2iQ Dispatch has been deprecated in favor of Flux. See the <a href="https://d2iq.com/blog/goodbye-dispatch-hello-fluxcd">D2iQ blog post</a> for more information.</p>

# Release Notes for Dispatch 1.3.1

## v1.3.1 - Released November 10, 2020
Document Modified Date: Released November 18, 2020

This document describes the new features, caveats, and resolved issues of D2iQ Dispatch. 

### Disclaimer

* Release notes are sometimes updated with new information about restrictions and caveats. Please see [https://docs.d2iq.com/ksphere/dispatch/](https://docs.d2iq.com/ksphere/dispatch/) for the latest version of the D2iQ Dispatch release-notes.

### Installation and Upgrades

To install Dispatch, follow one of the two options below:
- **Installation**: Run `konvoy init` and then update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml`. 

- **Upgrade**: Update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml` .

1. Update the following *example* snippet from `cluster.yaml` to upgrade Dispatch 1.2.x to 1.3.1.

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
    configVersion: stable-1.18-1.3.1
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
|Starlark | 0.8 |
|CUE | 0.6 |
|YAML | 0.5 |
|JSON | 0.5 |

### Improvements since v1.3.0

### Resolved Issues

- Fixed a bug where Dispatch will trigger 3 builds when a GitHub release is published.
- Fixed a bug where Dispatch fails to detect the dashboard URL when installed through Kubeaddons.