---
layout: layout.pug
navigationTitle: Change the Access Token Lifetime
title: Change the Access Token Lifetime
menuWeight: 40
excerpt: Changing the Access Token Lifetime.
beta: false
enterprise: false
---

By default, the client access token lifetime is 24 hours. After this time, the token expires and cannot be used to authenticate. Follow these steps to change the lifetime:

1.  Find the `dex` addon in cluster.yaml, and set its `values` field:

    ```yaml
    - name: dex
      enabled: true
      values: |
        config:
          expiry:
            idTokens: "48h"
    ```

2.  Run `konvoy deploy addons`, or `konvoy up` if you have yet to deploy the cluster.
