---
layout: layout.pug
title: Uninstalling
menuWeight: 5
excerpt: ""
featureMaturity: ""
enterprise: 'yes'
navigationTitle:  Uninstalling
---


1.  Delete each [pool](/docs/1.10/networking/edge-lb/glossary#edge-lb-pool) (and each [load balancer](/docs/1.10/networking/edge-lb/glossary#edge-lb-load-balancer) within it) with this command:

    ```bash
    dcos edgelb pool delete <name>
    ```

1.  Uninstall the [Edge-LB API server](/docs/1.10/networking/edge-lb/glossary#edge-lb-api-server)

    ```bash
    dcos package uninstall edgelb
    ```

1.  Remove the Universe repositories with these commands:

    ```bash
    dcos package repo remove edgelb-aws
    dcos package repo remove edgelb-pool-aws
    ```
