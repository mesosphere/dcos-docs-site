---
layout: layout.pug
navigationTitle: Multiple pools for a single service
title: Multiple pools for a single service
menuWeight: 7
excerpt: How to set up load balancing with multiple pool instances for a single service
enterprise: true
---

This tutorial demonstrates how to set up multiple load balancer instances to handle the load balancing duties for a single service. You typically implement this type of deployment scenario if you have a specific mission-critical service that has high-volume or high-frequency demand (a point of entry for microservices for example), requires added capacity to ensure reliability and responsiveness, or depends on transactional processing that involves high resource consumption or performance overhead.

# Before you begin

* Edge-LB is installed following the [Edge-LB Installation Guide](/services/edge-lb/getting-started/installing).
* The DC/OS CLI is installed and configured to communicate with the DC/OS cluster, and the `edgelb` CLI package has been installed.

# Exposing multiple services with multiple pools

This tutorial demonstrates how to deploy three services with three different Edge-LB pool instances, one pool instance per service. This provides high availability for your environent. For example, if you have 10 services running on Mesosphere cluster, you can configure 10 Edge-LB distinct pool instances per service to load-balance all 10 services. If a fault occurs with one of the pools in the cluster, the disruption is contained with that service in the pool instance as other services will keep routing traffic to the correct backend instances.

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

2. Deploy service `ping` by installing `ping.json` app:

```bash
dcos marathon app add ping.json
```
3. Example Edge-LB pool definition for `ping-lb.json` file:

```json
{
  "apiVersion": "V2",
  "name": "ping-lb",
  "count": 5,
  "haproxy": {
    "frontends": [
    {
      "bindPort": 15001,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "ping-backend"
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
    }
  ],
    "stats": {
      "bindPort": 0
    }
  }
}
```

4. Deploy Edge-LB pool instance to expose and access the `nginx` service by deploying `nginx-lb.json` pool config-file:

```bash
dcos edgelb create ping-lb.json
```

5. Example app definition for the `nginx.json` file:

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

6. Deploy the app for Nginx using `nginx.json` file:

```bash
dcos marathon app add nginx.json
```

7. Example Edge-LB pool definition for `nginx-lb.json` file:

```json
{
  "apiVersion": "V2",
  "name": "nginx-lb",
  "count": 1,
  "haproxy": {
    "frontends": [
    {
      "bindPort": 15002,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "nginx-backend"
      }
    }
   ],
    "backends": [
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
    }
  ],
    "stats": {
      "bindPort": 0
    }
  }
}
```

8. Deploy Edge-LB pool instance to expose and access the `nginx` service using `nginx-lb.json` pool config-file:

```bash
dcos edgelb create nginx-lb.json
```

9. Example app definition for the `echo.json` file:

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

10. Deploy the echo app using `echo.json` file:

```bash
dcos marathon app add echo.json
```

11. Example Edge-LB pool definition for `echo-lb.json` file:

```json
{
  "apiVersion": "V2",
  "name": "echo-lb",
  "count": 1,
  "haproxy": {
    "frontends": [
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

12. Deploy Edge-LB pool instance to expose and access the `echo` service by deploying `echo-lb.json` pool config-file:

```bash
dcos edgelb create echo-lb.json
```

13. Verify all services and the pool instance has been deployed sucessfully: 

```bash
dcos marathon app list
```

14. Verify pool configuration for frontend and stats ports using below command: 

```bash
dcos edgelb list
```

15. Verify the mesos task relevant to services and the pool instances using the below command: 

```bash
dcos task
```

16. Verify that the Edge-LB pool instance was deployed successfully with the configured frontend and backend ports: 

```bash
dcos edgelb endpoints multi-lb
```

17. Finally verify that you can access all deployed services using the Public IP and the front-end ports. You should be able to see a page for `pong`, a page for `Welcome to Nginx`, and a page for `"Hello from Marathon!"`: 

```bash
http://<public_agent_public_IP>:15001

http://<public_agent_public_IP>:15002

http://<public_agent_public_IP>:15003
```

18. Example Edge-LB pool config files for these deployed services: 

```bash
Linux-27464: dan$
Linux-27464: dan$ dcos edgelb endpoints ping-lb
  NAME            PORT   INTERNAL IP
  frontend_port0  15001  10.0.5.202
  stats_port      1025   10.0.5.202
Linux-27464: dan$
Linux-27464: dan$ dcos edgelb endpoints nginx-lb
  NAME            PORT   INTERNAL IP
  frontend_port0  15002  10.0.7.138
  stats_port      1025   10.0.7.138
Linux-27464: dan$
Linux-27464: dan$ dcos edgelb endpoints echo-lb
  NAME            PORT   INTERNAL IP
  frontend_port0  15003  10.0.7.138
  stats_port      1026   10.0.7.138
Linux-27464: dan$
Linux-27464: dan$
```

In the example above the frontend port is 15001, the stats port is 1025 for the ping-lb pool instance. The public IP of the public agent is 34.211.65.249. You could access the `pong` service by going to: 34.211.65.249:15001 and the stats for HAProxy by going to 34.211.65.249:15001/haproxy?stats page

**NOTE**: If you cannot access one of the pages, please ensure that configured Edge-LB frontend ports do not have conflict with other port that may be in use.

When deploying multiple edge-lb pool instances, be careful to have the Edge-LB pool instance names are unique. For example in this tutorial, the pool instances were `ping-lb`, `nginx-lb`, and `echo-lb`. 

