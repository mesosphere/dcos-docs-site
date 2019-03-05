---
layout: layout.pug
navigationTitle: Comparing load balancers
title: Comparing load balancing services
menuWeight: 15
excerpt: Summarizes the differences between Marathon-LB and Edge-LB load balancing services
enterprise: true
---

Code for Edge-LB config and Marathon-LB config
# Sample configuration example for app with Marathon-LB App - minitwit.json:

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
