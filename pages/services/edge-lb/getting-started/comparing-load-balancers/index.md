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
This tutorial demonstrates exposing and accessing the `nginx` service by using Marathon-LB and Edge-LB. It demonstrates the differences in configuration in terms of both load balancers. 

# Before you begin
- You must have Marathon-LB installed.
- You must have Edge-LB API Server installed.

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
    <img src="/services/edge-lb/img/Edge-LB-welcome-nginx.png" alt="Welcome page for a service using Edge-LB">
    </p>

1. Example screen shot of accessing the app that was exposed through Edge-LB: 

    <p>
    <img src="/services/edge-lb/img/Edge-HAProxy-stats.png" alt="Statistics for a service exposed using Marathon-LB">
    </p>

1. Example screen shot of accessing statistics of load balancing information for the service exposed through Edge-LB:

    <p>
    <img src="/services/edge-lb/img/Edge-HAProxy-stats-2.png" alt="Statistics for a service exposed using Edge-LB">
    </p>
