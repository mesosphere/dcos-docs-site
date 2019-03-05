---
layout: layout.pug
navigationTitle:  Uninstalling
title: Uninstalling
menuWeight: 50
excerpt: How to uninstall the Edge-LB package

enterprise: false
---

<p class="message--warning"><strong>WARNING: </strong>Do not use the DC/OS web interface or CLI (Marathon) to create or destroy services managed by Edge-LB. Operations must be performed exclusively through the Edge-LB CLI or the Edge-LB API.</p>

To uninstall Edge-LB:
1. List the pools which are managed by Edge-LB.

    ```bash
    dcos edgelb list
    ```

1. Delete each pool returned from the list command in the previous step by running the following command:

    ```bash
    dcos edgelb pool delete <name>
    ```
    Deleting pools automatically uninstalls managed load balancers.

1. Uninstall the Edge-LB API server by running the following command:

    ```bash
    dcos package uninstall edgelb
    ```

1. Remove the Universe repositories by running the following commands:

    ```bash
    dcos package repo remove edgelb-aws
    dcos package repo remove edgelb-pool-aws
    ```