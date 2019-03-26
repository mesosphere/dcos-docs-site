---
layout: layout.pug
navigationTitle: Technical architecture deep-dive
title: Architectural deep-dive
menuWeight: 20
excerpt: Provides a more detailed view of Edge-LB components within the network topology for a cluster
enterprise: true
---

Edge-LB provides the inbound load balancing and proxying functionality for layer-7. The two main components of Edge-LB are the Edge-LB API server and Edge-LB pool. This section provides a deeper view into the details of the Edge-LB architecture and how it works. 

The following diagram provides a more detailed representation of the Edge-LB architecture.

<p>
<img src="/services/edge-lb/img/Edge-LB-4.png" alt="Detail view of Edge-LB components">
</p>

# A closer look at the Edge-LB API server
The Edge-LB API interacts with the CLI clients and provides Create, Read, Update and Delete (CRUD) functionality for Edge-LB pools. It takes the end-user request for creating, deleting, and updating Edge-LB pool instances. The API server also serves the API endpoint requests for Edge-LB pool(s) instances.

<!--## ZooKeeper communication-->
The Edge-LB API server uses the persistent storage of ZooKeeper to store the configuration file for the load balancer. It communicates to the Edge-LB pool instances through the ZooKeeper. This allows Edge-LB to be fault tolerant. In the event of an API server failure, the Edge-LB pool instances continue to load-balance traffic to the proper backend. When the Edge-LB API server comes back online, it re-establishes the communication between itself and the pool instances.

The Edge-LB API server has two sub-components:
- Mesos listener
- DC/OS template

## Mesos listener
The `mesos-listener` sub-component is always up by default. It subscribes to the Mesos event stream, translates the event stream data into internal data structure, and serves useful metadata through the API server. It also runs a gRPC server to serve the Mesos task information to other Edge-LB components like `dcos-template`.

## DC/OS template
The `dcos-template` sub-component dynamically renders the load balancer configuration information for HAProxy by combining the `mesos-listener` output and the Edge-LB pool configuration provided by the Edge-LB CLI client. The template then signals the `lbmgr` sub-component to take appropriate action on the HAProxy load balancer instance.

In the event of Edge-LB pool update, the `dcos-template` re-generates the HAProxy load balancer configuration from the Edge-LB pool configuration file and signals `lbmgr` to reload the existing HAProxy configuration in real-time.

# A closer look at Edge-LB pools
The Edge-LB pool provides the load balancing functionality for Edge-LB software. You can have a single Edge-LB pool instance or multiple pool instances. You can configure a single pool or multiple pool instances. The pool instances can be scaled up or down using the `count` variable in the pool configuration file.

There are no Edge-LB pool instances created by default. An operator has to create a pool instance by deploying Edge-LB pool configuration file. You can create the pool configuration file in JSON format and can have one or multiple services in the same pool configuration.

Edge-LB pool has two sub-components:
- Load balancing manager (lbmgr)
- HAProxy

## Load balancer manager (lbmgr)

The load balancing manager (`lbmgr`) in Edge-LB pool instances manages the life cycle of the HAProxy load balancer. The `lbmgr` takes the CRUD action on the pool upon receiving the requests from API server. It constantly monitors the health of the HAProxy instances. If an HAProxy instance goes down, the `lbmgr` process respawns the HAProxy instance in another available agent and starts load balancing the traffic.

The load balancing manager is in charge of reloading the HAProxy load balancer. It validates the new load balancer configuration before a reload. When there is a reload signal, it sets a timeout interval to reload the HAProxy instance. If there is no additional signal, it reloads the HAProxy instance after the reload signal has passed. If there is an additional signal within the previous timeout signal, it resets the currently set timeout interval.

## HAProxy instances 
HAProxy instances provide the proxying and load balancing functionality for Edge-LB to the proper back-end services.