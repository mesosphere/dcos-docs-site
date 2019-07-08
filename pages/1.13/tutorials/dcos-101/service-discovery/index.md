---
layout: layout.pug
navigationTitle: Discover deployed services
title: Discover deployed services
excerpt: Demonstrates how to discover and connect to services in your DC/OS cluster (part 7)
menuWeight: 7
render: mustache
model: /1.13/data.yml
---
In a previous tutorial, you deployed a [sample app](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.py) that connected to the Redis service. If you reviewed the script for that app, you might have noticed these lines for connecting to the Redis service:

```
print("Running on node '"+  os.getenv("HOST") + "' and port '" + os.getenv("PORT0"))
r = redis.StrictRedis(host='redis.marathon.l4lb.thisdcos.directory', port=6379, db=0)
if r.ping():
       print("Redis Connected. Total number of keys:", len(r.keys()))
else:
       print("Could not connect to redis")
```

In this excerpt from the sample app script, you can see that the app uses:
- **redis.marathon.l4lb.thisdcos.directory** as the service address.
- port **6379** as the service port. 

It is important to note, however, that one of the advantages of a distributed computing environment is that a service--like the Redis service in this example--might be running on any agent in the cluster. In addition, the host address and the port number for accessing the service can change dynamically in response to changes in the cluster such as a failed node.

This tutorial explores how DC/OS determines the IP addresses and ports where specific service instances are running.

# Before you begin
Before starting this tutorial, you should verify the following:
- You have access to a running [DC/OS cluster](../start-here/) with at least at least one master node and three agent nodes.
- You have access to a computer where the [DC/OS CLI](../cli/) is installed.
- You have the sample [dcos-101/app1](../first-app/) application deployed and running in your cluster.
- You have the domain information command-line utility `dig` available on the computer you use to connect to the cluster. The `dig` utility is part of the DNS BIND utilities that are installed by default with most Linux distributions.

# Learning objectives
By completing this tutorial, you will learn:
- The service discovery options available in DC/OS.
- How DC/OS resolves service addresses to find running instances.

# Service discovery options
In a DC/OS cluster, [service discovery](/1.13/networking/) provides a method for finding applications regardless of where they might be running in the cluster. With service discovery, you can find where deployed services are running in the DC/OS cluster in one of two ways:

 - By resolving private or public agent node IP addresses for tasks through the **Mesos domain naming service (Mesos-DNS)**.

 - Through manually-set **named virtual IP addresses** that are not resolved through the Mesos domain naming service.

Keeping service discovery separate from traditional DNS name resolution (in which service records are associated with a specific physical or virtual IP addresses) is particularly useful in cases where applications fail and might be restarted on a different host.

<a name="mesos-dns"></a> 

## Using Mesos-DNS
The most common service discovery option is Mesos-DNS. Mesos-DNS provides a relatively simple method for finding applications inside the cluster. [Mesos-DNS](../../../networking/DNS/mesos-dns/) assigns DNS entries for every task. These task-specific DNS entries are then resolvable from any node in the cluster. 

The naming pattern for Mesos-DNS entries is:
*task.scheduler.mesos*

Because the default scheduler for the Redis service you have deployed is [Marathon](../../../overview/architecture/components/#marathon), the Mesos-DNS name for your Redis service is *redis.marathon.mesos* or *redis-tutorial.marathon.mesos*.

### Find the host address (A) record
You can use DNS query tools, such as [dig](https://linux.die.net/man/1/dig), to retrieve address (A) and service (SRV) record from the DNS nameserver. In a DC/OS cluster, the master nodes manage the naming service and by default are configured to use Mesos-DNS as the primary DNS service.

1. Open a secure shell (SSH) session to access the master node leader by running the following command:

      ```bash
      dcos node ssh --master-proxy --leader
      ```

1. If you are prompted to confirm connecting to the host, type `yes`.

1. Find the DNS address (A) record for the Redis service (`redis-tutorial.marathon.mesos` in this example) by running the following command:

      ```bash
      dig redis-tutorial.marathon.mesos
      ```

1. Review the output for this command to determine where the service is running:

      ```
      ; <<>> DiG 9.11.2-P1 <<>> redis-tutorial.marathon.mesos
      ;; global options: +cmd
      ;; Got answer:
      ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 36245
      ;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

      ;; QUESTION SECTION:
      ;redis-tutorial.marathon.mesos.	IN	A

      ;; ANSWER SECTION:
      redis-tutorial.marathon.mesos. 60 IN	A	10.0.1.95

      ;; Query time: 0 msec
      ;; SERVER: 198.51.100.1#53(198.51.100.1)
      ;; WHEN: Tue Jun 25 18:04:19 UTC 2019
      ;; MSG SIZE  rcvd: 63
      ```

      In the ANSWER section, you can see that the service in this example is running on the host with the IP address 10.0.1.95.

### Find the host service port (SRV) record
To connect to the service, you also need to know the port. In retrieve this information, Mesos-DNS assigns each Marathon app a service (SRV) record containing the port number. 

1. Find the DNS service (SRV) record for the Redis service (`redis-tutorial.marathon.mesos` in this example) by running the following command:

      ```bash
      dig srv _redis-tutorial._tcp.marathon.mesos
      ```

1. Review the output for this command to determine the port where the service is running:

      ```
      ; <<>> DiG 9.11.2-P1 <<>> srv _redis-tutorial._tcp.marathon.mesos
      ;; global options: +cmd
      ;; Got answer:
      ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 31738
      ;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

      ;; QUESTION SECTION:
      ;_redis-tutorial._tcp.marathon.mesos. IN	SRV

      ;; ANSWER SECTION:
      _redis-tutorial._tcp.marathon.mesos. 60	IN SRV	0 1 24936 redis-tutorial-xyipd-s1.marathon.mesos.

      ;; ADDITIONAL SECTION:
      redis-tutorial-xyipd-s1.marathon.mesos.	60 IN A	10.0.1.95

      ;; Query time: 0 msec
      ;; SERVER: 198.51.100.1#53(198.51.100.1)
      ;; WHEN: Tue Jun 25 18:15:33 UTC 2019
      ;; MSG SIZE  rcvd: 127
      ```

      In the ANSWER section, you can see that the service in this example is running on port  24936. IP address 10.0.1.95.

With the information from these two commands, you know that the Redis service in this cluster is running on the agent node host 10.0.1.95 and using port 24936.

### Limitations of using Mesos-DNS
Using Mesos-DNS for service discovery is appropriate for many applications, but has the following drawbacks:

- Applications sometimes cache DNS entries for efficiency. If an application caches DNS information, the Mesos-DNS service might not be able to provide updated address information, for example, after a task failure.

- You must use SRV DNS records to retrieve information about the allocated ports. While most applications support DNS address (A) look-up requests, not all applications support DNS service (SRV) records.

<a name="named-vips"></a> 

## Using named virtual IP addresses
[Named virtual IP addresses (VIPs)](../../../networking/load-balancing-vips/) enable you to manually assign name and port number pairs to your applications. With this type of service discovery, you can give applications recognizable names with predictable port information. 

Virtual IP addresses also allow you to take advantage of DC/OS internal layer-4 load balancing when there are multiple instances of an application. For example, you can assign a named virtual IP address to the Redis service by adding the following to the app definition for the package:

```json
"VIP_0": "/redis:6379"
```

 The full name is then generated using the following format:
 
 *vip-name.scheduler.l4lb.thisdcos.directory:vip-port*

This is the discovery method used in the sample [application](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.py) to enable access to the Redis service from within the cluster at `redis.marathon.l4lb.thisdcos.directory:6379`.

Named virtual IP addresses provide the following advantages:
- Load balancing for the IP address/port pair can use an algorithm that optimizes traffic routing in relation to the original requestor. 

- The virtual IP address provides a local caching layer for high performance. 

- You can give your apps meaningful names and select a specific port. 

Because of these advantages over Mesos-DNS, in most cases, you should use named virtual IP addresses for service discovery in DC/OS.

# Next steps
You know how to use service discovery to connect to your application from within your DC/OS cluster, and have learned about the two mechanisms for service discovery available in DC/OS.

# Related topics
Now that you have a basic introduction to [Mesos-DNS](#mesos-dns) and [named virtual IP address](#named-vips) networking, you might want to explore these and other [networking](../../../networking/) options in more detail.