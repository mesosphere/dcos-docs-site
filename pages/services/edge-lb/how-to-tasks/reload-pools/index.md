---
layout: layout.pug
navigationTitle: Reloading and restarting pools
title: Reloading and restarting pools
menuWeight: 40
excerpt: Describes reload and restart scenarios for Edge-LB pools
enterprise: true
---
This section describes the common reload and relaunch scenarios for Edge-LB pools and how to restore load balancing for a service after a pod failure.

# Before you begin
Before you create Edge-LB pools and pool configuration files, you should have DC/OS Enterprise cluster nodes installed and ready to use and have previously downloaded and installed the latest Edge-LB packages. 

For information about installing Edge-LB packages, see the [installation](/services/edge-lb/getting-started/installing/) instructions.

# Normal reload scenario
A change to a service (such as scaling up) that is load balanced by a pool will automatically trigger a reload of the pool configuration file and restart the load balancer instances for that service. 

During this type of normal reload scenario, you can expect the following behavior:
* No traffic is dropped unless the service instance that was serving the request was killed.

* The load balancer will keep any existing long-running connections intact.

* All the new connections will be proxied using the new reloaded configuration.

This type of reload occurs at most once every 3 seconds. Normal reload operations play a key role in enabling zero-downtime deployment strategies like the one described in the [Blue/Green service deployment](/services/edge-lb/tutorials/blue-green-deploy) tutorial.

# Load balancer relaunch scenario
A change to the load balancer pool (such as adding a secret) will trigger a relaunch of all load balancers in the pool. 

During this type of load balancer relaunch scenario, you can expect the following behavior:
* Traffic currently flowing through the given load balancer is dropped when it is stopped. To minimize the impact of stopping and restarting a load balancer instance, you should run more than one load balancer instance within the pool.

* Only one load balancer is stopped in the pool during the update at a time.

* The load balancer will be relaunched on the same node (unless the node itself has failed).

<p class="message--warning"><strong> WARNING: </strong>The number of instances of load balancers cannot be scaled down. This limitation will be addressed in a future Edge-LB release.</p>

# Replacing a failed pod
By default, Edge-LB load balancer instances are tied to a given node. when the node goes down, Edge-LB does not automatically relocate the pod containing the Edge-LB load balancer instance to a new node. You must issue a `pod replace` command to the pool scheduler to tell it to start the load balancer instance on a new node. If a machine hosting a pod is permanently lost, manual intervention is required to discard the missing pod and start it on a new node.

You can perform the necessary steps using the `edgelb-pool` command-line interface subcommand. The `edgelb-pool` command-line interface is distinct from the `edgelb` subcommand that is installed with the Edge-LB package. You must install the `edgelb-pool` command-line interface separately if you have not previously installed this package.

1. Install the `edgelb-pool` CLI subcommand:

    ```bash
    $ dcos package install edgelb-pool --cli --yes
    ```

2. Get the name of the pool that owns the pod you need to relocate:

    ```bash
    $ dcos edgelb list
    ```

    This command lists all of the Edge-LB pool configurations you have deployed. The pool that has a missing pod in this list identifies the `<pool-name>` you specify in the next step.

3. Get the name of the pod you need to replace (the one that was running on the removed public agent) by running the following command: 

    ```bash
    $ dcos edgelb-pool --name=/dcos-edgelb/pools/<pool-name> pod list
    ```

    This command returns the pod name you specify for the `<pod-id>` in the next step.

4. Replace the `<pod-id>` that is no longer running using the `pod replace` command as follow:

    ```bash
    $ dcos edgelb-pool --name=/dcos-edgelb/pools/<pool-name> pod replace <pod-id>
    ```

    This command destroys the pool server and relaunchs a new Edge-LB pool on the new public agent.
