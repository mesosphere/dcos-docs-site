---
layout: layout.pug
navigationTitle: Calico Version
title: Calico Version
menuWeight: 8
excerpt: Use a specific Calico version
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

# Calico Version

Konvoy ships with the latest Calico version available at the point of release.
If you require a specific version, you can configure it in `cluster.yaml`:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    containerNetworking:
      calico:
        version: v3.16.8
```

For more information, see:

- [Calico Releases](https://github.com/projectcalico/calico/releases)
