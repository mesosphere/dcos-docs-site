---
layout: layout.pug
navigationTitle:  Marathon-LB overview
title: Marathon-LB overview
excerpt: Marathon-LB provides proxy and load balancing services for Marathon-orchestrated apps running on DC/OS
menuWeight: 5
--- 
Marathon and Marathon load balancer (Marathon-LB) work together to provide a meta-framework for scheduling, container orchestration, and load balancing as part of the Mesosphere DC/OS platform.

# Marathon orchestrates apps and frameworks
Without load balancing, Marathon runs on the DC/OS cluster to act as the orchestrator for scheduling other applications and services to run. When you use Marathon, it is the first framework launched and its scheduler processes are started directly at startup with other initialization processes. The following diagram illustrates Marathon managing two instances of the MyApp scheduler that were started from a Docker image and other application containers for JBoss, Jetty, Sinatra, and Rails service instances.

<p>
<img src="/services/img/marathon-basic-overview.png" alt="Simplified view of Marathon orchestration">
</p>

If one of its scheduler instances fails, Marathon can restart it on another node that has available capacity to ensure that two MyApp scheduler instances are always running. In this example, the MyApp scheduler represents a supported framework that receives resource offers and can start its own tasks on the cluster. In the diagram, the MyApp scheduler runs two tasks. One task is a job that dumps a production MySQL database to S3. The other task sends an email newsletter job to an application that forwards the newsletter to all customers. 

As this example illustrates, Marathon can start and manage individual application instances, manage the availability of other framework instances, help clustered applications maintain 100% uptime within any resource constraints you  specify, and can coexist with other frameworks that create their own workloads in the cluster.

# Basic Marathon scaling and fault recovery
To illustrate scaling, assume you have a cluster where Marathon running three applications: Search, Jetty, and Rails. Each application is scaled to a different number of containers: one for Search, three for Jetty, and five for Rails.

If you decide to scale out the Search service and Rails-based application, you might use the Marathon REST API to add more instances. Marathon then takes care of placing the new containers on agent nodes with spare capacity, honoring any constraints you have previously set. After adding the new Search and Rails instances, your cluster of agent nodes might look like this: 

<p>
<img src="/services/img/marathon-add-instances.png" alt="Adding app instances using Marathon">
</p>

If one of the servers where an application instance runs becomes unavailable, Marathon simply moves the affected containers to another node in the cluster that has spare capacity as illustrated in the following diagram.

<p>
<img src="/services/img/marathon-failover-instances.png" alt="Failover for app instances from a disconnected node">
</p>

In this example, a datacenter worker unplugs an agent node where Search and Rails instances were previously running. In response, Marathon moves the Search and Rails instances from the agent that is no longer available to other agent nodes, maintaining  the application’s effective uptime even when there’s been a physical machine failure.

# How Marathon-LB works 
Marathon load balancer (Marathon-LB) is based on `HAProxy`, which is open-source software that acts as a proxy server and load balancer for TCP, HTTP, and HTTPS requests. `HAProxy` provides high-availability failover support, load balancing, server health checks, and throughput metrics for TCP and HTTP based applications. `HAProxy` load balancing helps to ensure that application workload does not negatively affect application performance while routing traffic efficiently and preventing service interruptions.

`HAProxy` supports secure socket layer (SSL) authentication and authorization for connecting to applications, HTTP compression, endpoints for checking server health and activity, and customizable templates for modifying the `HAProxy` configuration settings. 

You can also customize operations for `HAProxy` and Marathon-LB through Lua scripting or Marathon REST API calls.

## Locating services and ports for load balancing
When your app is up and running, you need a way to send traffic to it from other applications on the same cluster and from external clients. The most common way network traffic is routed to the appropriate application instances running on the appropriate agent nodes is through the domain name services ([DNS](http://en.wikipedia.org/wiki/Domain_Name_System)) you deploy. 

For example, [Mesos-DNS](https://github.com/mesosphere/mesos-dns) provides service discovery through a cluster-aware domain name service that identifies IP addresses for master and agent nodes. For more information about service discovery and the default Mesosphere DNS configuration, see [DNS](/1.12/networking/DNS/mesos-dns/) and [DNS API](http://docs.mesosphere.com/1.12/networking/DNS/mesos-dns/mesos-dns-api).

Marathon-LB locates applications through the Marathon framework port-based service discovery using a virtual or DNS-defined IP address and the frontend and backend configuration settings specified for the HAProxy program. For a detailed description of how ports work in Marathon, see [Networking](https://mesosphere.github.io/marathon/docs/networking.html).

If you install and configure Marathon-LB, the load balancer runs the `HAProxy` TCP/HTTP proxy service on each host in the cluster. The `HAProxy` service listens for inbound connection requests on a service port on a public agent node. If clients connect to the service port to request access to an app, the `HAProxy` service transparently forwards the requests to a host name and port number associated with the individual application instances orchestrated by the Marathon service.

## What Marathon-LB provides
Marathon-LB is a Dockerized application that includes a script for running the `HAProxy` program, a default configuration file, endpoints and support for the Marathon REST API. You can secure communication through the `HAProxy` program by enabling secure socket layer (SSL) connections and creating and storing encrypted certificates. The `HAProxy` program also supports sticky sessions to send all requests in a session to the same instance, and virtual host (vhost) load balancing, allowing you to specify virtual hosts for your Marathon applications.

With Marathon-LB, you can use the virtual IP address routing you configure for the network to allocate dedicated, virtual addresses to your applications. The virtual IP address enables the app to be available to any node in the cluster, regardless of where it might be scheduled to run.

You can also configure Marathon-LB on DC/OS enterprise clusters to define authorization rules to support multi-tenancy, with each user or group granted access to its own applications and groups.

For more information about Marathon features and benefits, see [Marathon features](https://mesosphere.github.io/marathon/docs/networking.html).  For more information about features that are specific to Marathon-LB or using Marathon with DC/OS, see [Marathon-LB features](https://mesosphere.github.io/marathon/docs/networking.html).

# Marathon-LB as a cluster-edge load balancer
An **edge load balancer** is used to accept traffic from outside networks and proxy that traffic to the application containers inside the DC/OS cluster. The edge load balancer is located outside of the firewall with a port that accepts inbound requests through a publicly-exposed IP address or virtual IP address and routes the requests to the appropriate nodes responsible for servicing specific applications requests inside of the cluster network.

The following diagram illustrates using Marathon-LB as the edge load balancer that accepts TCP and HTTP-based traffic from the internet that is then routed into applications inside the cluster. In this scenario, the load balancer doesn’t route internal requests.

<p>
<img src="/services/img/marathon-edge-external-facing.png" alt="Marathon-LB as an external-facing edge load balancer">
</p>

# Marathon-LB for internal and external requests
You can also use Marathon-LB to perform load balancing and routing for both internal and external requests.

The following diagram illustrates using Marathon-LB as both an external load balancer and internal load balancer routing TCP and HTTP-based traffic. In this scenario, a separate edge load balancer receives traffic from the internet outside of the cluster and routes the external traffic to the Marathon-LB external load balancer instance separate from the traffic routed to the Marathon-LB internal balancer instance.

<p>
<img src="/services/img/marathon-internal-external.png" alt="Marathon-LB distributing internal and external traffic">
</p>

# Common load balancing scenarios
You can configure Marathon-LB to work with different load balancing strategies and network topologies. As part of your planning process, you might want to consider how best to use Marathon-LB to suit the specific details of your environment. 

The following scenarios represent the most common load balancing strategies and the network configuration used in each case:

* One simple strategy is to use Marathon-LB strictly as an internal load balancer for application instances running on the cluster and to route internal client requested to discovered services.

* A slightly more complex alternative would be to use Marathon-LB as the edge load balancer and for service discovery. In this scenario, you could run Marathon-LB on public-facing nodes to route inbound traffic, using the IP addresses of the public-facing nodes in the A-records for the internal or external DNS records to route traffic to its intended destination.

* Another potential strategy would involve using Marathon-LB as an internal and external load balancer for cluster inbound requests with a separate high-availability load balancer for routing public-facing traffic. For example, you might use an external F5 load balancer for an on-premise cluster, or an Elastic Load Balancer (ELB) for a cluster deployed on Amazon Web Services.

If none of these common load balancing strategies suits your organization, you might want to use a combination of internal and external load balancers, with different services exposed on different load balancers.