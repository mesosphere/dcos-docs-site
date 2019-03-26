---
layout: layout.pug
navigationTitle: Comparing load balancers
title: Comparing load balancing services
menuWeight: 15
excerpt: Summarizes the differences between Marathon-LB and Edge-LB load balancing services
enterprise: true
---
Marathon-LB is the predecessor of Edge-LB. It is based on a single container that manages all processing, including the generation and reloading of configuration files and load balancing activity. While Marathon-LB provides you the capability to load-balance internet-facing applications ingressing into DC/OS cluster, Edge-LB provides the benefit of high availability, configuration validation, and advanced configuration options for flexible load balancing traffic ingressing into the DC/OS cluster.

Marathon-LB can only speak to services running on Marathon. Any services running on Mesos Executor/Task is unknown to Marathon-LB. It listens to the Marathon event bus and therefore limits itself to exposing and accessing apps based on Marathon apps only whereas Edge-LB can expose and access any apps and services running on DC/OS cluster.

Edge-LB supports all DC/OS applications and services or workloads running on DC/OS cluster. It loadbalances the tasks associated with Mesos frameworks including Data Services. As the ecosystem grew from just Marathon-based apps to SDK based apps like Data services (Cassandra, Kafka, etc.) and load balancing services deployed on K8s cluster running with Mesosphere automation. It reduced the operational complexity when it comes to service upgrade advanced configurations. It provides much more flexibility and control over what operators can do to expose services outside the cluster. 

Edge-LB is built as a DC/OS framework, which can leverage the same DC/OS SDK that all of your production data services are using. This means that you get the same rock solid reliability and platform integration that your mission critical databases and analytics applications are using. With the DC/OS SDK as its foundation, Edge-LB can seamlessly incorporate new features as DC/OS expands.

Marathon-LB relies on app labels which allows for two different users to specify the same labels, but for different applications. As a result, you could have two completely different applications using the same labels and therefore leveraging the same Marathon-LB configuration, resulting in unintended configuration collision.

Edge-LB removes this potential for misconfiguration. Mesos task names are used instead of labels as the primary mechanism for determining what to load balance. The user is required to define the tasks that they intend to load-balance. This explicit definition ensures uniqueness, since Marathon and other frameworks enforce unique task names.

# Validation and fault tolerance
Edge-LB does some basic configuration validation before deploying, compared to MLB which only does it at installation time. The same is true for configuration changes.  With Edge-LB, you can do configuration reloads without any disruptions. Compare this with MLB, this would mean a complete reinstall which makes the process a lot more error prone and manual. From a deployment standpoint, you could develop a template which could be validated by Edge-LB and as the platform evolves the level of validation can increase.

Edge-LB provides high availability and fault tolerance with multiple pool instances. With Marathon-LB, an invalid configuration setting can take down whole cluster causing network outages.

# Support for container network standards
Edge-LB supports industry-standard container network interface (CNI) based networks thereby providing you with increased deployment options for your load-balancing strategy.

# Benefits of Edge-LB over Marathon-LB at-a-glance
The key benefits of the load balancing provided by Edge-LB over those provided by Marathon-LB are: 
- Edge-LB supports all applications in DC/OS cluster, not just Marathon-based apps.
-	Edge-LB has high-availability with multiple Edge-LB pool for high availability.
-	Edge-LB provides better configuration validation during installation.

# Example comparison of Marathon-LB and Edge-LB

<!--# Sample configuration for Marathon-LB
The following JSON example illustrates the contents of a Marathon app definition for the service minitwit.json that uses Marathon-LB load balancing:

```json
{
  "id": "minitwit",
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "karlkfi/minitwit",
      "network": "BRIDGE",
      "portMappings": [
        {
          "hostPort": 0,
          "containerPort": 80,
          "servicePort": 10004
        }
      ]
    }
  },
  "instances": 3,
  "cpus": 1,
  "mem": 512,
  "healthChecks": [
    {
      "protocol": "MESOS_HTTP",
      "path": "/",
      "portIndex": 0,
      "timeoutSeconds": 2,
      "gracePeriodSeconds": 15,
      "intervalSeconds": 3,
      "maxConsecutiveFailures": 2
    }
  ],
  "labels": {
    "HAPROXY_GROUP": "external",
    "HAPROXY_0_STICKY": "true",
    "HAPROXY_0_VHOST": "<public_agent_public_IP>"
  }
}
```

Configuration example for app with my-app  - my-app-2.json:

```json
{
  "id": "minitwit",
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "karlkfi/minitwit",
      "network": "BRIDGE",
      "portMappings": [
        {
          "hostPort": 0,
          "containerPort": 80,
          "protocol": "tcp",
          "name": "web"
        }
      ]
    }
  },
  "instances": 3,
  "cpus": 1,
  "mem": 512,
  "healthChecks": [
    {
      "protocol": "MESOS_HTTP",
      "path": "/",
      "portIndex": 0,
      "timeoutSeconds": 2,
      "gracePeriodSeconds": 15,
      "intervalSeconds": 3,
      "maxConsecutiveFailures": 2
    }
  ]
}
```

# Sample configuration for an application
Configuration example for app with my-app  - my-app-2-edgeLBPool.json:
```json
{
  "apiVersion": "V2",
  "name": "minitwit-pool",
  "count": 1,
  "haproxy": {
    "frontends": [
      {
        "bindPort": 80,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "minitwit"
        }
      }
    ],
    "backends": [
      {
        "name": "host-httpd",
        "protocol": "HTTP",
        "services": [
          {
            "marathon": {
              "serviceID": "/minitwit"
            },
            "endpoint": {
              "portName": "web"
            }
          }
        ]
      }
    ]
  }
}
```

# How Edge-LB compares to Marathon-LB
The following table provides an overview of the differences between Edge-LB and Marathon-LB load balancing services.

| Edge-LB | Marathon-LB |
|---------|-------------|
| Deployed on any node (Public for ingress) | Generally deployed on DC/OS public agents providing cluster wide ingress Load Balancing |
| Operators deploy individual pool server and load balancers (specific to tenants, groups of applications that share a specific config, or other business rules). | Application developers specify templates or service-specific labels within their app definitions. The labels are picked by the Marathon-LB service from the Marathon Event bus. |
| Designed to scale and provide granular control and differentiated service | Marathon-LB is most often deployed as a single container service with cluster-wide configuration. |
| Applications are explicitly added to the load balancer by administrative users. The load balancer pool is configured for the specific backend service by deploying a new pool configuration. | The service automatically generates load balancer configuration based on the labels and reloads the HAProxy service.
-->