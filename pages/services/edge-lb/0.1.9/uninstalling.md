---
post_title: Uninstalling Edge-LB
menu_order: 20
post_excerpt: ""
feature_maturity: ""
enterprise: 'yes'
---

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
