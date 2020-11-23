---
layout: layout.pug
navigationTitle:  Release Notes for 1.1.1 
title: Release Notes for 1.1.1
menuWeight: 10
beta: false
excerpt: View release-specific information for Dispatch 1.1.1
---

# Release Notes

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Dispatch [/button]

<p class="message--note"><strong>NOTE: </strong>You must be a registered user and signed on to the support portal to download this product. For new customers, contact your sales representative or <a href="mailto:sales@d2iq.com">sales@d2iq.com</a> before attempting to download Dispatch.</p>

## v1.1.1 - Released 13 May 2020

This document describes the new features, caveats, and resolved issues of D2iQ Dispatch.
### Frontend Languages

| Frontend Language | Version |
| ------------------ | ------- |
|Starlark | 0.5 |
|CUE | 0.2 |
|YAML | 0.2 |
|JSON | 0.2 |

### Improvements

- Fixed incorrect population of dashboard-url for generate-pipeline manifests. (D2IQ-68190)
- Fixed the report-status task to set --insecure-skip-tls-verify from environment.(D2IQ-68293) 
- Protect artifacts from being overwritten by user defined tasks using internal (minio) storage. (D2IQ-68030)
- Ignore branch deletion events from GitHub. (D2IQ-65672)
- Fixed PipelineValidationFailed error when some task result variables are not present in Dispatchfile. (D2IQ-68189)

### Installation & Upgrade

Follow one of the two options below:
- **Installation**: Run `konvoy init` and then update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml`. 

- **Upgrade**: Update the `configVersion` for `https://github.com/mesosphere/kubeaddons-dispatch` in your `cluster.yaml` .


1. Update the following snippet from `cluster.yaml`:

```
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.16-1.0.1
    addonsList:
    - name: dispatch
      enabled: false
```

It should read:

```
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.16-1.1.1
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

### Known Issues

- The CLI command `dispatch version` returns `latest` instead of `1.1.1`.
