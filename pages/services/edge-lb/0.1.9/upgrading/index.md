---
post_title: Upgrading Edge-LB
menu_order: 25
post_excerpt: ""
feature_maturity: ""
enterprise: 'yes'
---

Perform an Edge-LB upgrade by uninstalling your current version of Edge-LB, then reinstall from the remote repositories.

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
1. [Reinstall Edge-LB](/service-docs/edge-lb/0.1.9/installing/).
