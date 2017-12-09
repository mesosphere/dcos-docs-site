---
layout: layout.pug
navigationTitle:  Uninstalling Edge-LB
title: Uninstalling Edge-LB
menuWeight: 5
excerpt:
featureMaturity:
enterprise: true
---

*Do not* use the UI or CLI (marathon) to create or destroy services managed by
Edge LB. Operations *must performed exclusively through the Edge LB CLI*.

1.  Delete each [pool](/1.11/networking/edge-lb/architecture#edge-lb-pool) (and each [load balancer](/1.11/networking/edge-lb/architecture#edge-lb-load-balancer) within it) with this command:

    ```bash
    dcos edgelb pool delete <name>
    ```

1.  Uninstall the [Edge-LB API server](/1.11/networking/edge-lb/architecture#edge-lb-api-server)

    ```bash
    dcos package uninstall edgelb
    ```

1.  Remove the Universe repositories with these commands:

    ```bash
    dcos package repo remove edgelb-aws
    dcos package repo remove edgelb-pool-aws
    ```
