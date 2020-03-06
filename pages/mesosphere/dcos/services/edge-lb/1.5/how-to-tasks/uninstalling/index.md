---
layout: layout.pug
navigationTitle:  Uninstalling Edge-LB
title: Uninstalling Edge-LB
menuWeight: 50
excerpt: How to uninstall the Edge-LB package
enterprise: true
---

You can remove the Edge-LB API server and pool packages interactively or programmatically using the Edge-LB command-line interface (CLI) or Edge-LB API calls. You should not use the DC/OS&trade; web-based console or the core DC/OS command-line interface (Marathon CLI) to create or destroy Edge-LB pools, load balancer instances, or the Edge-LB API or pool packages. You must perform Edge-LB management operations exclusively through the Edge-LB CLI or Edge-LB API.

You can use the DC/OS web-based console or the core DC/OS command-line interface (Marathon CLI) to add, modify, or delete the services when access to those services is no longer managed through Edge-LB pools.

# Before you begin

You must have:
* Edge-LB installed as described in the Edge-LB [installation instructions](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing).
* The `edgelb` command-line interface (CLI) installed.

# To uninstall Edge-LB
1. List the pools which are managed by Edge-LB:

    ```bash
    dcos edgelb list
    ```

1. Delete each pool returned from the list command in the previous step:

    ```bash
    dcos edgelb delete <pool-name>
    ```

    <p class="message--note"><strong>NOTE:  </strong>Deleting pools automatically uninstalls managed load balancers.</p>

1. Uninstall the Edge-LB API server:

    ```bash
    dcos package uninstall edgelb
    ```

1. Remove the Edge-LB package repositories. In most cases, you can remove the repositories with these commands:

    ```bash
    dcos package repo remove edgelb
    dcos package repo remove edgelb-pool
    ```

    If you installed Edge-LB AWS repositories, remove them with the commands:

    ```bash
    dcos package repo remove edgelb-aws
    dcos package repo remove edgelb-pool-aws
    ```

1. Remove all Amazon Web Services&reg; (AWS&reg;) Elastic Load Balancer&reg; (ELB&reg;) instances, if applicable:

    ```bash
    dcos edgelb cleanup
    ```

     <p class="message--note"><strong>NOTE:  </strong>If you deployed the cloud connector to use Edge-LB with the Amazon Web Services (AWS) Elastic Load Balancer (ELB), you should run the <strong>dcos edgelb cleanup</strong> command to remove any ELB instances that remain after Edge-LB has been uninstalled from a DC/OS cluster.</p>
