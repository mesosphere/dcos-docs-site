---
layout: layout.pug
navigationTitle:  Exposing a Service
title: Exposing a Service
menuWeight: 5
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


DC/OS agent nodes can be designated as [public](/1.8/overview/concepts/#public) or [private](/1.8/overview/concepts/#private) during [installation](/1.8/administration/installing/). Public agent nodes provide access from outside of the cluster via infrastructure networking to your DC/OS services. By default, services are launched on private agent nodes and are not accessible from outside the cluster. 

To launch a service on a public node, you must create a Marathon app definition with the `"acceptedResourceRoles":["slave_public"]` parameter specified and configure an edge load balancer and service discovery mechanism.  

**Prerequisite:**

* DC/OS is [installed](/1.8/administration/installing/)
* DC/OS CLI is [installed](/1.8/usage/cli/install/)


1.  Create a Marathon app definition with the `"acceptedResourceRoles":["slave_public"]` parameter specified. For example:

    ```json
    {
        "id": "/product/service/myapp",
        "container": {
        "type": "DOCKER",
        "docker": {
              "image": "group/image",
              "network": "BRIDGE",
              "portMappings": [
                { "hostPort": 80, "containerPort": 80, "protocol": "tcp"}
              ]
            }
        },
        "acceptedResourceRoles": ["slave_public"],
        "instances": 1,
        "cpus": 0.1,
        "mem": 64
    }
    ```

    For more information about the `acceptedResourceRoles` parameter, see the Marathon REST API [documentation](/1.8/usage/managing-services/rest-api/).

1.  Add the your app to Marathon by using this command, where `myapp.json` is your app:

    ```bash
    dcos marathon app add myapp.json
    ```

    If this is added successfully, there is no output.
    
     **Tip:** You can also add your app by using the **Services** tab of DC/OS [GUI](/1.8/usage/webinterface/#services). 

1.  Verify that the app is added with this command:

    ```bash
    dcos marathon app list
    ```
    
    The output should look like this:
    
    ```bash
    ID      MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  CONTAINER  CMD
        /myapp   64  0.1    0/1    ---      scale       DOCKER   None
    ```
    
    **Tip:** You can also view deployed apps by using the **Services** tab of DC/OS [GUI](/1.8/usage/webinterface/#services).
    
1.  Configure an edge load balancer and service discovery mechanism. 

    - AWS users: If you installed DC/OS by using the [AWS CloudFormation templates](/1.8/administration/installing/cloud/aws/), an ELB is included. However, you must reconfigure the health check on the public ELB to expose the app to the port specified in your app definition (e.g. port 80).
    - All other users: You can use [Marathon-LB](/1.8/usage/service-discovery/marathon-lb/), a rapid proxy and load balancer that is based on HAProxy. 

1.  Go to your public agent to see the site running. For information about how to find your public agent IP, see the [documentation](/1.8/administration/locate-public-agent/).

    You should see the following message in your browser: 
    
    ![Hello Brave World](/1.8/usage/managing-services/img/helloworld.png)
    
## Next steps

Learn how to load balance your app on a public node using [Marathon-LB](/1.8/usage/service-discovery/marathon-lb/marathon-lb-basic-tutorial/).

