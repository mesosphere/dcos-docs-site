---
layout: layout.pug
navigationTitle:  Introduction  
title: Introducing Dispatch
menuWeight: 10
beta: false
excerpt: Introduction to Dispatch 1.0.
---

This is the initial release of Dispatch.

Dispatch 1.0 was released on 28 February 2020.

This release of Dispatch includes features and capabilities for installation, pipeline configuration, setting up repositories, and operations.

[button color="purple" href="https://support.d2iq.com/s/entitlement-based-product-downloads"]Download Dispatch [/button]

# Upgrading

If you are upgrading, make sure to set `minio.persistence.size=100Gi` or upgrades will fail. In your `cluster.yaml`:

```yaml
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.16-1.0.0
    addonsList:
    - name: dispatch
      enabled: true
      values: |
        minio:
          persistence:
            size: 100Gi
```
Or via `dispatch init`:

```bash
dispatch init --set minio.persistence.size=100Gi
```

## Upgrading from 1.0.0-rcX

There is an issue with upgrading from 1.0.0-rcX to 1.0.0. Prior to upgrading, run:

```bash
kubectl delete jobs -n dispatch dispatch-set-argocd-auth-token
```