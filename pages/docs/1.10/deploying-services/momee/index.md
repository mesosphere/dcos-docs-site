---
layout: layout.pug
title: ""
menuWeight: 39
excerpt: ""
featureMaturity: preview
enterprise: 'yes'
navigationTitle:  ""
---

This topic describes how to deploy non-native instances of Marathon on DC/OS. The non-native instances of Marathon will be deployed as a DC/OS service by the native instance of Marathon.  

## Terminology

-  **Native Marathon** The Marathon instance that is installed as a part of your DC/OS installation. This instance runs on the master nodes.
-  **Non-native Marathon** A Marathon instance that you can install as a DC/OS service. Non-native Marathon instances run on private agent nodes. You may need additional private agent nodes to accommodate the increased resource demands.

## Dynamic and Static Reservations
You can reserve cluster resources for specific agent nodes. You can reserve resources directly in an agent node (static), or specify reserved resources in your app definition (dynamic).

-  **Static:** Configure an agent with resources reserved for a role. To modify a static reservation, you must drain and restart the agent with the new configuration.
-  **Dynamic:** Reserve and unreserve resources by specifying in your non-native Marathon app definition.

For more information, see [Mesos reservations](http://mesos.apache.org/documentation/latest/reservation/).

# Basic
Use this procedure to deploy on non-native Marathon instance with isolated roles, reservations, and quotas. The basic procedure does not support [DC/OS Secrets](/docs/1.10/security/secrets/). If you require secrets for your DC/OS environment, you must use the custom non-native Marathon [procedure](/docs/1.10/deploying-services/marathon-on-marathon/advanced/).

# Advanced 
Use this procedure if you require secrets or fine-grained ACLs in your non-native Marathon instance.

Enterprise DC/OS [security features](/docs/1.10/security/) provide robust fine-grained access control in DC/OS. DC/OS production environments should be as independent from development environments as possible. However, there are situations when you might require a partitioned environment, for example: 

-  Testing DC/OS upgrades or API changes.
-  Isolating developer groups from each other securely, such that developers in one group cannot negatively impact workloads running in another group. By default, each DC/OS service uses the same [Mesos role](http://mesos.apache.org/documentation/latest/roles/) that the native Marathon registered with for quotas and reservations. This means that Marathon users can run tasks under any Linux user that Marathon can run tasks under. You can isolate workloads by using non-native Marathon and leveraging these Mesos features on DC/OS:

   -  [Reservations](http://mesos.apache.org/documentation/latest/reservation/): used to reserve resources in specific agent nodes. 
   -  [Roles](http://mesos.apache.org/documentation/latest/roles/): used to specify that certain resources are reserved for the use of one or more DC/OS services.
   -  [Quotas](https://mesos.apache.org/documentation/latest/quota/): used to specify the minimum amount of resources that the role is guaranteed to receive. 