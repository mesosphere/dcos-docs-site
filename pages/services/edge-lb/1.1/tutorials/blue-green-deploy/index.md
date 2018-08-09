---
layout: layout.pug
navigationTitle:  Blue/Green Service Update
title: Blue/Green Service
menuWeight: 30
excerpt: Tutorial - Using blue/green deployment

enterprise: false
---

A blue/green deployment is a method of achieving zero downtime by running two versions of the same service (a "blue" and a "green" version) and having the load balancer switch between the two.

Blue/green deployment allows you to have two fully scaled versions of the service. If something goes wrong with one, you can quickly switch to the other by adjusting the load balancer.

### Use Case: Service Upgrade

1. The `web-server` service has "blue" and "green" versions that are running and the load balancer is routing traffic successfully to "blue".
1. The Edge-LB configuration is updated to route traffic to "green" and errors start occurring in the "green" service's logs.
1. The deployment is quickly rolled back by reverting Edge-LB to the original configuration.

# Prerequisites

* Edge-LB CLI is installed.

  ```
  dcos package install edgelb --cli
  ```

* Enough capacity on the DC/OS cluster for two fully deployed services.

# Example Deployment

Below is a minimal Edge-LB configuration, `sample-minimal.json`, that load balances "svc-blue".

```json
{
  "apiVersion": "V2",
  "name": "sample-config",
  "count": 1,
  "haproxy": {
    "frontends": [{
      "bindPort": 80,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "svc"
      }
    }],
    "backends": [{
      "name": "svc",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/svc-blue"
          },
          "endpoint": {
            "portName": "web"
          }
      }]
    }]
  }
}
```

Copy the example service and name it `svc-blue.json`.

```json
{
    "id": "/svc-blue",
    "cmd": "/start $PORT0",
    "instances": 1,
    "cpus": 0.1,
    "mem": 32,
    "container": {
        "type": "DOCKER",
        "docker": {
            "image": "mesosphere/httpd"
        }
    },
    "portDefinitions": [
        {
            "name": "web",
            "protocol": "tcp",
            "port": 0
        }
    ],
    "healthChecks": [
        {
            "portIndex": 0,
            "path": "/",
            "protocol": "HTTP"
        }
    ]
}
```

Make another copy of the example service and name it `svc-green.json`.

```json
{
    "id": "/svc-green",
    "cmd": "/start $PORT0",
    "instances": 1,
    "cpus": 0.1,
    "mem": 32,
    "container": {
        "type": "DOCKER",
        "docker": {
            "image": "mesosphere/httpd"
        }
    },
    "portDefinitions": [
        {
            "name": "web",
            "protocol": "tcp",
            "port": 0
        }
    ],
    "healthChecks": [
        {
            "portIndex": 0,
            "path": "/",
            "protocol": "HTTP"
        }
    ]
}
```

1. Upload the configuration to Edge-LB.

   ```
   dcos edgelb create sample-minimal.json
   ```

1. Start the service "svc-blue".

   ```bash
   dcos marathon app add svc-blue.json
   ```

1. Now, "svc-blue" is exposed at `http://<public-ip>/`.

1. Begin blue/green deployment by deploying "svc-green".

   ```bash
   dcos marathon app add svc-green.json
   ```

1. Once `svc-green` is up and healthy, modify the Edge-LB configuration to point to `svc-green` by changing:

   ```json
   {
     ...
     "haproxy": {
       "backends": [{
         ...
         "services": [{
           "marathon": {
             "serviceID": "/svc-blue"
           },
           ...
         }]
       }]
     }
   }
   ```

   to:

   ```json
   {
     ...
     "haproxy": {
       "backends": [{
         ...
         "services": [{
           "marathon": {
             "serviceID": "/svc-green"
           },
           ...
         }]
       }]
     }
   }
   ```

1. Upload the modified configuration to Edge-LB.

   ```
   dcos edgelb update sample-minimal.json
   ```

1. Now "svc-green" is exposed at `http://<public-ip>/`.
