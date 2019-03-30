---
layout: layout.pug
navigationTitle: Comparing Edge-LB to Marathon-LB
title: Comparing Edge-LB to Marathon-LB
menuWeight: 16
excerpt: Demonstrates differences between Marathon-LB and Edge-LB load balancing services
enterprise: true
---
This tutorial demonstrates exposing and accessing the `nginx` service by using Marathon-LB and Edge-LB. It demonstrates the differences in configuration in terms of both load balancers. 

# Before you begin
* You must have the Edge-LB API server installed as described in the Edge-LB [installation instructions](/services/edge-lb/getting-started/installing).
* You must have the core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* You must have the `edgelb` command-line interface (CLI) installed.
* You must have an active and properly-configured DC/OS Enterprise cluster.
* The DC/OS Enterprise cluster must have at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.
* You must have Marathon-LB installed as described in the Marathon-LB [installation instructions](/services/marathon-lb/1.12.x/mlb-install).

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

1. Verify the services and pool instances has been deployed sucessfully: 

    ```bash
    dcos marathon app list
    ```

1. Verify the mesos task relevant to services and the pool instances using the below command:

    ```bash
    dcos task
    ```

1. Verify that the Edge-LB pool named `nginx-elb` has been deployed successfully: 

    ```bash
    dcos edgelb list
    ```

1. Verify that the Edge-LB pool instance was deployed successfully with the configured frontend and backend ports: 

    ```bash
    dcos edgelb endpoints nginx-elb
    ```

1. Access the app deployed app `nginx-mlb` that was exposed through Marathon-LB using the Public IP of the public agents specified in the `nginx-mlb.json` config-file. You should be able to see a page for `Welcome to Nginx - through Marathon-LB`: 

    ```bash
    http://<public_agent_public_IP>:10020
    ```

1. View the load-balanced statistics of the deployed app through Marathon-LB using the stats port 9090:

    ```bash
    http://<public_agent_public_IP>:9090
    ```

1. Access the app deployed app `nginx` that was exposed through Edge-LB using the public agent IP and the frontend port number. You should be able to see a page for `Welcome to Nginx - through Edge-LB`: 

    ```bash
    http://<public_agent_public_IP>:15001
    ```

1. View the load-balanced statistics of the deployed app through Edge-LB using the stats port 1025:

    ```bash
    http://<public_agent_public_IP>:1025
    ```

1. Example screen shot of accessing the app that was exposed through Marahon-LB: 

    <p>
    <img src="/services/edge-lb/img/Edge-MLB-nginx.png" alt="Welcome page for a service using Marathon-LB">
    </p>

1. Example screen shot of accessing statistics of load balancing information for the service exposed through Marahon-LB:

    <p>
    <img src="/services/edge-lb/img/Edge-HAProxy-stats.png" alt="Statistics for a service exposed using Marathon-LB">
    </p>

1. Example screen shot of accessing the app that was exposed through Edge-LB: 

    <p>
    <img src="/services/edge-lb/img/Edge-LB-welcome-nginx.png" alt="Welcome page for a service using Edge-LB">
    </p>

1. Example screen shot of accessing statistics of load balancing information for the service exposed through Edge-LB:

    <p>
    <img src="/services/edge-lb/img/Edge-HAProxy-stats-2.png" alt="Statistics for a service exposed using Edge-LB">
    </p>
