---
layout: layout.pug
navigationTitle:  Uninstalling Edge-LB
title: Uninstalling Edge-LB
menuWeight: 20
excerpt:

enterprise: false
---

Uninstall the Edge-LB package with these instructions.

*Do not* use the GUI or CLI (Marathon) to create or destroy services managed by Edge-LB. Operations must be performed exclusively through the Edge-LB CLI.

1.  Deleting pools will automatically uninstall managed load balancers. Delete each pool with this command.

    ```bash
    dcos edgelb pool delete <name>
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
