---
layout: layout.pug
navigationTitle:  Uninstalling
title: Uninstalling
menuWeight: 20
excerpt: Uninstalling the Edge-LB package

enterprise: false
---


<p class="message--warning"><strong>WARNING: Do not use the GUI or CLI (Marathon) to create or destroy services managed by Edge-LB. Operations must be performed exclusively through the Edge-LB CLI or the Edge-LB API.</p>

1.  List the pools which are managed by Edge-LB

    ```bash
    dcos edgelb list
    ```

1. Deleting pools will automatically uninstall managed load balancers. Delete each pool from the previous step with this command.

    ```bash
    dcos edgelb delete <pool-name>
    ```

1.  Uninstall the Edge-LB API server.

    ```bash
    dcos package uninstall edgelb
    ```

1.  Remove the Universe repositoriess.

    ```bash
    dcos package repo remove edgelb-aws
    dcos package repo remove edgelb-pool-aws
    ```
