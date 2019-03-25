---
layout: layout.pug
navigationTitle: Multiple services in a single pool
title: Multiple services in a single pool
menuWeight: 6
excerpt: How to load balance multiple services in a single Edge-LB instance
enterprise: true
---

# Before you begin

* Edge-LB is installed following the [installation instructions](/services/edge-lb/getting-started/installing).
* The DC/OS CLI is installed and configured to communicate with the DC/OS cluster, and the `edgelb` CLI package has been installed.

This tutorial demonstrates how to set up three services with a single Edge-LB pool instance. This flexibility allows you to configure Edge-LB pool depending on your need to achieve high availability in your environment. For example, if you have 90 services running on the DC/OS cluster, you can configure 30 Edge-LB pool instance with 3 services each to load-balance all 90 services.

1. Example app definition for the `ping.json` file:

```json
{
  "id": "/ping",
  "cpus": 0.1,
  "mem": 32,
  "instances": 1,
  "cmd": "echo \"pong\" > index.html && python -m http.server $PORT0",
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "python:3"
    }
  },
  "healthChecks": [
   {
    "protocol": "MESOS_HTTP",
    "path": "/",
    "portIndex": 0,
    "gracePeriodSeconds": 5,
    "intervalSeconds": 10,
    "timeoutSeconds": 10,
    "maxConsecutiveFailures": 3
   }
  ],
  "portDefinitions": [
   {
    "protocol": "tcp",
    "port": 0,
    "name": "pong-port"
   }
  ],
  "requirePorts": true
}
```

2. Deploy the `ping.json` app:

```bash
dcos marathon app add ping.json
```

3. Example app definition for the `nginx.json` file:

```json
{
  "id": "/nginx",
  "cpus": 0.1,
  "instances": 1,
  "mem": 128,
  "container": {
    "portMappings": [
    	{
        "containerPort": 80,
        "protocol": "tcp",
        "name": "nginx-port"
      }
     ],
    "type": "MESOS",
    "docker": {
    	"image": "nginx"
    }
  },
  "networks": [
  	{
  	  "mode": "container/bridge"
  	}
 ]
}
```

4. Deploy the app for Nginx using `nginx.json` file:

```bash
dcos marathon app add nginx.json
```

5. Example app definition for the `echo.json` file:

```json
{
  "id": "/echo",
  "args": [
    "-listen", ":80",
    "-text", "\"Hello from Marathon!\""
  ],
  "cpus": 0.1,
  "instances": 1,
  "mem": 128,
  "container": {
    "portMappings": [
    	{
        "containerPort": 80,
        "protocol": "tcp",
        "name": "echo-port"
      }
     ],
    "type": "MESOS",
    "docker": {
    	"image": "hashicorp/http-echo"
    }
  },
  "networks": [
  	{
  	  "mode": "container/bridge"
  	}
 ]
}
```

5. Deploy the echo app using `echo.json` file:

```bash
dcos marathon app add echo.json
```

6. Example Edge-LB pool definition for `multi-lb-pool.json` file:

```json
{
  "apiVersion": "V2",
  "name": "multi-lb",
  "count": 1,
  "haproxy": {
    "frontends": [
    {
      "bindPort": 15001,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "ping-backend"
      }
    },
    {
      "bindPort": 15002,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "nginx-backend"
      }
    },
    {
      "bindPort": 15003,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "echo-backend"
      }
    }
   ],
    "backends": [
    {
      "name": "ping-backend",
      "protocol": "HTTP",
      "services": [
       {
        "marathon": {
          "serviceID": "/ping"
        },
        "endpoint": {
          "portName": "pong-port"
        }
      }
     ]
    },
    {
      "name": "nginx-backend",
      "protocol": "HTTP",
      "services": [
        {
        "marathon": {
          "serviceID": "/nginx"
        },
        "endpoint": {
          "portName": "nginx-port"
        }
      }
     ]
    },
    {
      "name": "echo-backend",
      "protocol": "HTTP",
      "services": [
       {
        "marathon": {
          "serviceID": "/echo"
        },
        "endpoint": {
          "portName": "echo-port"
        }
      }
     ]
    }
  ],
    "stats": {
      "bindPort": 0
    }
  }
}
```

7. Deploy single Edge-LB pool instance to expose and access all 3 services using `multi-lb.json` file:

```bash
dcos edgelb create multi-lb-pool.json
```

8. Verify all services and the pool instance has been deployed sucessfully: 

```bash
dcos marathon app list
```

8. Verify the pool configuration for frontend and stats ports using below command: 

```bash
dcos edgelb list
```

9. Verify the all pool related configuration using below command: 

```bash
dcos edgelb show multi-lb
```

9. Verify the mesos task relevant to services and the pool instances using the below command: 

```bash
dcos task
```

10. Verify that the Edge-LB pool instance was deployed successfully with the configured frontend and backend ports: 

```bash
dcos edgelb endpoints multi-lb
```

11. Finally verify that you can access all deployed services using the Public IP and the front-end ports. You should be able to see a page for `pong`, a page for `Welcome to Nginx`, and a page for `"Hello from Marathon!"`: 

```bash
http://<public_agent_public_IP>:15001

http://<public_agent_public_IP>:15002

http://<public_agent_public_IP>:15003
```

**NOTE**: If you cannot access one of the pages, please ensure that all Edge-LB front-end port does not have conflict with other port that may be in use.
