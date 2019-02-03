---
layout: layout.pug
navigationTitle:  Tutorial - Scaling apps using Marathon-LB statistics
title: Tutorial - Automated scaling using Marathon-LB statistics  
menuWeight: 35
excerpt: How to automate application scaling using Marathon-LB statistics
enterprise: false
---

You can use the Marathon-LB HAProxy statistics endpoint report to monitor application health and performance, and as input for application scheduling and scaling. The `HAProxy` program collects data points using performance counters and 1-second rates for various metrics.

One way you can use the metrics that Marathon-LB generates through HAProxy is to implement automatic scaling for Marathon apps.

# What this tutorial demonstrates

This tutorial guides you through the steps for configuring Marathon-LB if you want to use the load balancing statistics to automate application scaling.

After completing this tutorial, you will have hands-on practice configuring a sample application that uses load balancing statistics to automate the deployment of instances to address increasing demand.

# Measuring application requests-per-second

For a given application, you can measure performance in terms of **requests-per-second** for a given set of resources. If the application is stateless and scales horizontally, you can then scale the number of app instances proportionally to the average number of requests-per-second over a certain number of intervals.

As part of this tutorial, the `marathon-lb-autoscale` script polls the HAProxy `stats` endpoint and automatically scales application instances based on the incoming number of requests.

<p>
<img src="/services/img/marathon-lb-autoscale.png" alt="Using Marathon-LB statistics for automatic scaling">
</p>

The autoscale script takes the current requests-per-second and divides that number by the target number of requests-per-second for the app instance. The result of this fraction is the number of app instances required (or rather, the ceiling of that fraction is the number of instances required).

<p>
<img src="/1.12/img/image00.png" alt="Current requests-per-second divided by target requests-per-second">

# Before you begin

* You must have a DC/OS cluster installed.
* The DC/OS cluster must have at least one master node, at least three private agent nodes, and at least one public agent node.
* You must have an account with access to the DC/OS web-based administrative console or DC/OS command-line interface.
* You must have Marathon-LB installed.

# Identify the apps for demonstration purposes
To demonstrate autoscaling, assume you have the following Marathon apps:
* `marathon-lb-autoscale` is a script that monitors `HAProxy` and scales the sample app using the Marathon API.
* `nginx` is the demonstration application.
* `siege` is a tool for generating HTTP requests.

# Configure app definitions for automatic scaling
To illustrate automatic scaling, you need to configure and deploy the app definitions for the Marathon apps.

1. Open a shell terminal.

1. Create a text file and copy the following [sample app definition](https://gist.github.com/brndnmtthws/2ca7e10b985b2ce9f8ee) file to prepare the `marathon-lb-autoscale` application.

    ```json
    {
    "id": "marathon-lb-autoscale",
    "args":[
        "--marathon", "http://leader.mesos:8080",
        "--haproxy", "http://marathon-lb.marathon.mesos:9090",
        "--target-rps", "100",
        "--apps", "nginx_10000"
    ],
    "cpus": 0.1,
    "mem": 16.0,
    "instances": 1,
    "container": {
        "type": "DOCKER",
        "docker": {
        "image": "brndnmtthws/marathon-lb-autoscale",
        "network": "HOST",
        "forcePullImage": true
        }
    }
    }
    ```

    The [sample app definition](https://gist.github.com/brndnmtthws/2ca7e10b985b2ce9f8ee) passes the following arguments that are important for load balancing: 

    * `--target-rps` specifies the requests-per-second you want the `marathon-lb-autoscale` load balancing instance to use for scaling purposes.

    * `--apps` specifies a comma-separated list of the Marathon apps and service ports to monitor, concatenated with an underscore (_). 

    Each app could expose multiple service ports to the load balancer, if configured to do so. The `marathon-lb-autoscale` instance scales the app to meet the greatest common denominator for the number of required instances.

1. Save the app definition for the `marathon-lb-autoscale` load balancing instance.

1. Run the `marathon-lb-autoscale` application using Marathon. For example:

    ```
    dcos marathon app add https://gist.githubusercontent.com/brndnmtthws/2ca7e10b985b2ce9f8ee/raw/66cbcbe171afc95f8ef49b70034f2842bfdb0aca/marathon-lb-autoscale.json
    ```

1. Start an external Marathon-LB instance if it is not already running:

    ```bash
    dcos package install marathon-lb
    ```

1. Create a text file and copy the following [sample app definition](https://gist.github.com/brndnmtthws/84d0ab8ac057aaacba05) to prepare the NGINX test application instance:

    ```json
    {
    "id": "nginx",
    "container": {
        "type": "DOCKER",
        "docker": {
        "image": "nginx:1.7.7",
        "network": "BRIDGE",
        "portMappings": [
            { "hostPort": 0, "containerPort": 80, "servicePort": 10000 }
        ],
        "forcePullImage":true
        }
    },
    "instances": 1,
    "cpus": 0.1,
    "mem": 65,
    "healthChecks": [{
        "protocol": "HTTP",
        "path": "/",
        "portIndex": 0,
        "timeoutSeconds": 10,
        "gracePeriodSeconds": 10,
        "intervalSeconds": 2,
        "maxConsecutiveFailures": 10
    }],
    "labels":{
        "HAPROXY_GROUP":"external"
    }
    }
    ```

1. Save the app definition for the `nginx` test application.

1. Start the NGINX test application instance using Marathon: 

    ```bash
    dcos marathon app add https://gist.githubusercontent.com/brndnmtthws/84d0ab8ac057aaacba05/raw/d028fa9477d30b723b140065748e43f8fd974a84/nginx.json
    ```

1. Create a text file and copy the following [sample app definition](https://gist.github.com/brndnmtthws/fe3fb0c13c19a96c362e) for the `siege` application.

    ```json
    {
    "id": "siege",
    "args":[
        "-d1",
        "-r1000",
        "-c100",
        "http://marathon-lb.marathon.mesos:10000/"
    ],
    "cpus": 0.5,
    "mem": 16.0,
    "instances": 1,
    "container": {
        "type": "DOCKER",
        "volumes": [],
        "docker": {
        "image": "yokogawa/siege",
        "network": "HOST",
        "privileged": false,
        "parameters": [],
        "forcePullImage": false
        }
    }
    }
    ```
1. Save the app definition for the `siege` application.

1. Start the `siege` application using Marathon:

    ```bash
    dcos marathon app add https://gist.githubusercontent.com/brndnmtthws/fe3fb0c13c19a96c362e/raw/32280a39e1a8a6fe2286d746b0c07329fedcb722/siege.json
    ```

1. In your web browser, navigate to the HAProxy statistics endpoint to display the HAProxy status page where you can see requests hitting the NGINX instance. 

    For example, if the agent IP address is `52.35.15.50` and you are using the default endpoint:<br>

    <code>52.35.15.50:9090/haproxy?stats</code>

    <p>
    <img src="/1.12/img/image02-800x508.png" alt="HAProxy statistics">
    </p>

    Check the “Session rate” to see the number requests-per-second generated on the NGINX application frontend.

1. Scale the `siege` app to generate a large number of HTTP requests.

    For example:

    ```bash
    dcos marathon app update /siege instances=15
    ```

    After a few minutes, you should see that the NGINX app has been automatically scaled up to serve the increased traffic.

# Exploring scaling on your own
You can experiment further with automated application scaling using the additional parameters for the `marathon-lb-autoscale` sample script. For example, you might want to try changing the interval, number of samples, or other values until you achieve the desired effect. 

The default values are fairly conservative. In experiementing with these values, you might want to include a 50 percent safety factor in the target RPS. For example, if you want your application to meet service-level agreement (SLA) at 1500 requests-per-second with 1 CPU and 1 GiB of memory, you might want to set the target RPS to 1000.

For more information about the parameters you can set to work with the `marathon-lb-autoscale` script, see the [autoscale usage information](https://github.com/mesosphere/marathon-lb-autoscale). 