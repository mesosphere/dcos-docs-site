---
layout: layout.pug
navigationTitle:  Upgrading Edge-LB
title: Upgrading Edge-LB
menuWeight: 25
excerpt:

enterprise: false
---

Perform an Edge-LB upgrade by following this procedure.

1.  Delete the Edge-LB pools.

    ```bash
    dcos edgelb pool delete <name>
    ```

1.  Uninstall the Edge-LB API server.

    ```bash
    dcos package uninstall edgelb
    ```

1.  Remove the Universe repositories.

    ```bash
    dcos package repo remove edgelb-aws
    dcos package repo remove edgelb-pool-aws
    ```
1. [Reinstall Edge-LB](/services/edge-lb/0.1/installing/).
