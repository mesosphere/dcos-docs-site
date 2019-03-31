---
layout: layout.pug
navigationTitle:  Uninstalling Edge-LB
title: Uninstalling Edge-LB
menuWeight: 50
excerpt: How to uninstall the Edge-LB package
enterprise: true
---
You can remove the Edge-LB API server and pool packages interactively or programmatically by using the Edge-LB command-line interface (CLI) or Edge-LB API calls. You should not use the DC/OS web-based console or the core DC/OS command-line interface (Marathon CLI) to create or destroy Edge-LB pools, load balancer instances, or the Edge-LB API or pool packages. You must perform Edge-LB management operations exclusively through the Edge-LB CLI or Edge-LB API.

You can use the DC/OS web-based console or the core DC/OS command-line interface (Marathon CLI) to add, modify, or delete the services when access to those services is no longer managed through Edge-LB pools.

# Before you begin
* You must have Edge-LB installed as described in the Edge-LB [installation instructions](/services/edge-lb/getting-started/installing).
* You must have the `edgelb` command-line interface (CLI) installed.

# To uninstall Edge-LB
1. List the pools which are managed by Edge-LB by running the following command:

    ```bash
    dcos edgelb list
    ```

1. Delete each pool returned from the list command in the previous step by running the following command:

    ```bash
    dcos edgelb pool delete <pool-name>
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