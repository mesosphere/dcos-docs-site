---
layout: layout.pug
navigationTitle: External DNS
title: External DNS
menuWeight: 30
excerpt: This section describes how to use external-dns to maintain your hostnames
beta: false
enterprise: false
---

If you need to use `external-dns` to maintain your hostnames, you must add some overrides to the app section of your installation config file that you pass onto `kommander install`. Adjust your `kommander.yaml` file to include these values:

```yaml
  traefik:
    values: |
      service:
        annotations:
          external-dns.alpha.kubernetes.io/hostname: mycluster.domain.dom
  external-dns:
    values: |
      aws:
        credentials:
          secretKey: <aws secret key>
          accessKey:  <aws access key>
        region: <aws region>
        preferCNAME: true
      policy: sync
      txtPrefix: local-
      domainFilters:
        - domain.dom
```
