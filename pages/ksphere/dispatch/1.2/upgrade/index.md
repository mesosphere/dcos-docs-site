---
layout: layout.pug
navigationTitle:  Updating
title: Updating
menuWeight: 85
beta: false
excerpt: Upgrade your installation of Dispatch
---

When upgrading, make sure to set `minio.persistence.size=100Gi` or upgrades will fail. In your `cluster.yaml`:

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
