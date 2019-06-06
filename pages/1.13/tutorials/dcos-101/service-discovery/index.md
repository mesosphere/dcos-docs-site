---
layout: layout.pug
navigationTitle: Discover deployed services
title: Discover deployed services
excerpt: Demonstrates how to discover and connect to services in your DC/OS cluster (part 7)
menuWeight: 7
---
In the previous tutorial, you deployed a [sample app](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.py) that connected to the Redis service. If you reviewed the script for that app, you might have noticed these lines for connecting to the Redis service:

```
print("Running on node '"+  os.getenv("HOST") + "' and port '" + os.getenv("PORT0"))
r = redis.StrictRedis(host='redis.marathon.l4lb.thisdcos.directory', port=6379, db=0)
if r.ping():
       print("Redis Connected. Total number of keys:", len(r.keys()))
else:
       print("Could not connect to redis")
```

In this excerpt from the sample app script, you can see that the app uses `redis.marathon.l4lb.thisdcos.directory` as the service address and port 6379 as the service port. It is important to note, however, that one of the advantages of a distributed computing environment is that a service--like the Redis service in this example--might be running on any agent in the cluster. In addition, the host address and the port number for accessing the service can change dynamically in response to changes in the cluster such as a failed node.

This tutorial explores how DC/OS determines the IP addresses and ports where specific service instances are running.

# Before you begin
Before starting this tutorial, you should verify the following:
- You have access to a running [DC/OS cluster](../start-here/) with at least at least one master node and three agent nodes.
- You have access to a computer where the [DC/OS CLI](../cli/) is installed.
- You have the sample [dcos-101/app1](/tutorials/dcos-101/app1/) application deployed and running in your cluster.
- You have the domain information command-line utility `dig` available on the computer you use to connect to the cluster. The `dig` utility is part of the DNS BIND utilities that are installed by default with most Linux distributions.

# Learning objectives
By completing this tutorial, you will learn:
- The service discovery options available in DC/OS.
- How DC/OS resolves service addresses to find running instances.

# Select a service discovery method
In a DC/OS cluster, [service discovery](/1.13/networking/) provides a method for finding applications regardless of where they might be running in the cluster. With service discovery, you can find where deployed services are running in the DC/OS cluster in one of two ways:

 - By resolving private or public agent node IP addresses for tasks through the **Mesos domain naming service (Mesos-DNS)**.
 - Through manually-set **named virtual IP addresses** that are not resolved through the Mesos domain naming service.

Keeping service discovery separate from traditional DNS name resolution (in which service records are associated with a specific physical or virtual IP addresses) is particularly useful in cases where applications fail and might be restarted on a different host.

## Using Mesos-DNS
The most common service discovery option is Mesos-DNS. Mesos-DNS provides a relatively simple method for finding applications inside the cluster. [Mesos-DNS](/networking/mesos-dns/) assigns DNS entries for every task. These task-specific DNS entries are then resolvable from any node in the cluster. 

The naming pattern for Mesos-DNS entries is  *task.scheduler.mesos* Because the default scheduler for the Redis service you have deployed is [Marathon](/overview/architecture/components/#marathon), the Mesos-DNS name for your Redis service is *redis.marathon.mesos* or redis-tutorial.marathon.mesos.

You can use DNS query tools, such as [dig](https://linux.die.net/man/1/dig), to retrieve address (A) and service (SRV) record from the DNS nameserver, which in a DC/OS cluster is configured to point at Mesos-DNS.

For example, you can run a command similar to this to find the IP address (A) record where an instance of the `redis.marathon.mesos` service is running:
 `dig redis.marathon.mesos`

This command returns an answer section be similar to the following indicating that the service is running on the host with the IP address 10.0.0.43:

 ```
 ;; ANSWER SECTION:
 redis.marathon.mesos. 60  IN  A 10.0.0.43
 ```
To connect to the service, you also need to know the port. In retrieve this information, Mesos-DNS also assigns each Marathon app a service (SRV) record containing the port number. You can run a command similar to the following to find the Redis SRV record:

 `dig srv _redis._tcp.marathon.mesos`

This command returns an answer section be similar to the following indicating that the Redis service is running on 10.0.0.43:30585

 ```
 ;; ANSWER SECTION:
 _redis._tcp.marathon.mesos. 60  IN  SRV 0 0 30585 redis-1y1hj-s1.marathon.mesos.

 ;; ADDITIONAL SECTION:
 redis-1y1hj-s1.marathon.mesos. 60 IN  A 10.0.0.43
 ```

Using Mesos-DNS for service discovery is appropriate for many applications, but has the following drawbacks:
* Applications sometimes cache DNS entries for efficiency and therefore might not provide updated address information in some cases, such as after a task failure.
 * You need to use SRV DNS records to retrieve information about the allocated ports. While applications commonly understand DNS A records, not all applications support SRV records.

## Using named virtual IP addresses
[Named virtual IP addresses (VIPs)](/networking/load-balancing-vips/) enable you to assign name/port pairs to your apps. With this type of service discovery, you can give apps recognizable names with predictable port information. 

Virtual IP addresses also allow you to take advantage of DC/OS layer-4 load balancing when there are multiple instances of an application. For example, you can assign a named virtual IP address to the Redis service by adding the following to the app definition for the package:

 ```
 "VIP_0": "/redis:6379"
 ```

 The full name is then generated using the following format:
 *vip-name.scheduler.l4lb.thisdcos.directory:vip-port*.

This is the discovery method used in the sample [application](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.py) for access the Redis service from within the cluster at `redis.marathon.l4lb.thisdcos.directory:6379`.

Named VIPs load balance the IP address/port pair using an intelligent algorithm to ensure optimal routing of the traffic in relation to the original requestor, and also provide a local caching layer for high performance. They also allow you to give your apps meaningful names and select a specific port. Because of these advantages over Mesos-DNS,in most cases you should use named virtual IP addresses for service discovery in DC/OS.

# Next steps
You know how to use service discovery to connect to your application from within your DC/OS cluster, and have learned about the two mechanisms for service discovery available in DC/OS.

# Related topics
Now that you have a basic introduction to [Mesos-DNS](#mesos-dns) and [named virtual IP address](#named-vips) networking. You might want to explore these network options in more detail.