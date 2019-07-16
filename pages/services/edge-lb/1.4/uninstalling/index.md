---
layout: layout.pug
navigationTitle:  Uninstalling
title: Uninstalling
menuWeight: 20
excerpt: Uninstalling the Edge-LB package

enterprise: false
---


<p class="message--warning"><strong>WARNING: </strong>Do not use the DC/OS web interface or CLI (Marathon) to create or destroy services managed by Edge-LB. Operations must be performed exclusively through the Edge-LB CLI or the Edge-LB API.</p>

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

1.  Remove the Universe repositories.

    ```bash
    dcos package repo remove edgelb-aws
    dcos package repo remove edgelb-pool-aws
    ```

1. Remove all Amazon Web Services (AWS) Elastic Load Balancer (ELB) instances, if applicable, by running the following command:

    ```bash
    dcos edgelb cleanup
    ```

    If you deployed the cloud connector to use Edge-LB with the Amazon Web Services (AWS) Elastic Load Balancer (ELB), you should run the `dcos edgelb cleanup` command to remove any ELB instances that remain after Edge-LB has been uninstalled from a DC/OS cluster.