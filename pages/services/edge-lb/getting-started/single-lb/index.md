---
layout: layout.pug
navigationTitle: Expose and load balance a service
title: Expose and load balance a sample service
menuWeight: 10
excerpt: Illustrates the basic steps for load balancing a single service running on DC/OS
enterprise: true
---

This tutorial demonstrates how to prepare load balancing for access to a single DC/OS service. For this tutorial, the access requests originate outside of the DC/OS cluster and are routed into the cluster through a public-facing IP address. This scenario illustrates the most common way orgnaizations get started with a load balancing solution.

# Before you begin
* You must have Edge-LB installed as described in the Edge-LB [installation instructions](/services/edge-lb/getting-started/installing).
* You must have the core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* You must have the `edgelb` command-line interface (CLI) installed.
* You must have an active and properly-configured DC/OS Enterprise cluster.
* The DC/OS Enterprise cluster must have at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.

# Create the sample app definition

This tutorial how to use an Edge-LB instance to expose and access a simple Marathon app. We will deploy a simple app called `ping`, expose it through Edge-LB pool instance called `ping-lb`, and access it through the URL. 

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

**NOTE:** One important thing to notice is that the portDefinitions.name must match the haproxy.backends.endpoint.portName. If they don't match the pool will not deploy successfully.

1. Deploy service `ping` by installing `ping.json` app:

```bash
dcos marathon app add ping.json
```
1. Example Edge-LB pool instance `ping-lb.json` config-file definition:

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

**NOTE:** Few important things to notice:
- The `name` indicates the pool instance name. This is important when you are trying to update, edit, and delete Edge-LB pool instance after initial deployment
- The `haproxy.frontends.linkBackend.defaultBackend` must match the `haproxy.backends.name` value
- The `haproxy.backends.endpoint.portName` in the pool config-file must match the `portDefinitions.name` in the app definition
- The `haproxy.frontends.bindPort: 15001` indicates the app will be accessible on port 15001
- The `haproxy.stats.bindPort: 0` indicates the stats port for load-balancing statistics will be dynamically allocated
- The `haproxy.backends.marathon.serviceID` must match the name of the app definition which in our case is `\ping`

# Deploy Edge-LB Pool to expose the service

1. Deploy `ping-lb` pool instance to expose and access the `ping` service by deploying `ping-lb.json` pool config-file:

```bash
dcos edgelb create ping-lb.json
```

1. Verify the services and the pool instance has been deployed sucessfully: 

```bash
dcos marathon app list
```

1. Verify pool configuration for frontend and stats ports by using below command: 

```bash
dcos edgelb list
```

1. Verify the mesos task relevant to services and the pool instances using the below command: 

```bash
dcos task
```

1. Verify that the Edge-LB pool instance was deployed successfully with the configured frontend and backend ports: 

```bash
dcos edgelb endpoints ping-lb
```

1. Verify the Edge-LB pool status: 

```bash
dcos edgelb status ping-lb
```

1. Check out the Edge-LB pool config: 
```bash
dcos edgelb status ping-lb
```

1. Check out all Edge-LB pool config in JSON format: 

```bash
dcos edgelb show multi-lb --json
```

# Access the service

1. Finally verify that you can access all deployed services using the Public IP and the front-end ports. You should be able to see a page for `pong`, a page for `Welcome to Nginx`, and a page for `"Hello from Marathon!"`: 

```bash
http://<public_agent_public_IP>:15001
```

1. Example Edge-LB pool config files for these deployed services: 

```bash
Linux-27464: dan$
Linux-27464: dan$ dcos edgelb endpoints ping-lb
  NAME            PORT   INTERNAL IP
  frontend_port0  15001  10.0.5.202
  stats_port      1025   10.0.5.202
Linux-27464: dan$
Linux-27464: dan$
```

In the example above the frontend port is 15001, the stats port is 1025 for the ping-lb pool instance. The public IP of the public agent is 34.211.65.249. You could access the `pong` service by going to: 34.211.65.249:15001 and the stats for HAProxy by going to 34.211.65.249:15001/haproxy?stats page

**NOTE**: If you cannot access one of the pages, please ensure that configured Edge-LB frontend ports do not have conflict with other port that may be in use.

When deploying multiple edge-lb pool instances, be careful to have the Edge-LB pool instance names are unique. For example in this tutorial, the pool instances were `ping-lb`, `nginx-lb`, and `echo-lb`. 

You can then use this information to determine the public IP address to use to access the load balancer. For more information about finding public IP addresses for your cluster, see [Finding a public agent IP](/1.13/administering-clusters/locate-public-agent/).

Access the load-balanced service at `http://<public-ip>/` to verify you have access to the app.

# Example comarison of Edge-LB and Marathon-LB

This tutorial demonstrates exposing and accessing the `nginx` service by using Marathon-LB and Edge-LB. It demonstrates the differences in configuration in terms of both load balancers. 

# Prerequisites
- Must have Marathon-LB installed
- Must have Edge-LB API Server installed

# Marathon-LB configuration

1. Example app definition for the `nginx-mlb.json` that includes public-IP to expose and access the `nginx` service:

```json
{
  "id": "/nginx-mlb",
  "cpus": 0.1,
  "instances": 1,
  "mem": 128,
  "cmd": "sed -i 's:Welcome to nginx!:Welcome to nginx! - through Marathon-LB:g' /usr/share/nginx/html/index.html; nginx -g 'daemon off;'",
  "container": {
    "portMappings": [
    	{
        "containerPort": 80,
        "protocol": "tcp",
        "servicePort": 10020
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
 ],
  "labels": {
    "HAPROXY_GROUP": "external",
    "HAPROXY_0_STICKY": "true",
    "HAPROXY_0_VHOST": "<Public agent IP address>"
  }
}
```

2. Deploy service `nginx` by installing `nginx-mlb.json` app:

```bash
dcos marathon app add nginx.json
```

3. Access the service by copying and pasting the public agent in the browser

```bash
http://<Public agent IP address>:10020
```

The above demonstrated that you can deploy a nginx service through Marathon-LB. Please note the public IP address of the public agents.

# Edge-LB configuration

1. Example app definition for the `nginx.json` file:

```json
{
  "id": "/nginx",
  "cpus": 0.1,
  "instances": 1,
  "mem": 128,
  "cmd": "sed -i 's:Welcome to nginx!:Welcome to nginx! - through Edge-LB:g' /usr/share/nginx/html/index.html; nginx -g 'daemon off;'",
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

2. Deploy the `nginx` app using the following command:

```bash
dcos marathon app add nginx.json
```

3. Example Edge-LB pool config file to expose and access the `nginx` service:

```json
{
  "apiVersion": "V2",
  "name": "nginx-elb",
  "count": 1,
  "haproxy": {
    "frontends": [
    {
      "bindPort": 15001,
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
      "bindPort": 1025
    }
  }
}
```

4. Deploy Edge-LB pool instance to expose and access the `nginx` service by deploying `echo-lb.json` pool config-file:

```bash
dcos edgelb create nginx-elb.json
```

# Verifying configurations and accessing the apps

1. Verify Marathon-LB and Edge-LB API server packages has been deployed sucessfully: 

```bash
dcos package list
```

2. Verify the services and pool instances has been deployed sucessfully: 

```bash
dcos marathon app list
```

3. Verify the mesos task relevant to services and the pool instances using the below command:

```bash
dcos task
```

6. Verify that the Edge-LB pool named `nginx-elb` has been deployed successfully: 

```bash
dcos edgelb list
```

7. Verify that the Edge-LB pool instance was deployed successfully with the configured frontend and backend ports: 

```bash
dcos edgelb endpoints nginx-elb
```
8. Access the app deployed app `nginx-mlb` that was exposed through Marathon-LB using the Public IP of the public agents specified in the `nginx-mlb.json` config-file. You should be able to see a page for `Welcome to Nginx - through Marathon-LB`: 

```bash
http://<public_agent_public_IP>:10020
```

9. View the load-balanced statistics of the deployed app through Marathon-LB using the stats port 9090:

```bash
http://<public_agent_public_IP>:9090
```

10. Access the app deployed app `nginx` that was exposed through Edge-LB using the public agent IP and the frontend port number. You should be able to see a page for `Welcome to Nginx - through Edge-LB`: 

```bash
http://<public_agent_public_IP>:15001
```

11. View the load-balanced statistics of the deployed app through Edge-LB using the stats port 1025:

```bash
http://<public_agent_public_IP>:1025
```

12. Example screen shot of accessing the app that was exposed through Marahon-LB: 

<Edge-MLB -1>

13. Example screen shot of accessing statistics of load balancing information for the service exposed through Marahon-LB:

<Edge-MLB -2>

14. Example screen shot of accessing the app that was exposed through Edge-LB: 

<Edge-MLB -3>

13. Example screen shot of accessing statistics of load balancing information for the service exposed through Edge-LB:

<Edge-MLB -4>




