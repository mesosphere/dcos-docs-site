---
layout: layout.pug
navigationTitle: Deploy and expose native applications
title: Deploy and expose native applications
excerpt: Deploys an app using a UCR container and exposes it for access from outside of the cluster (part 8)
menuWeight: 8
render: mustache
model: /1.13/data.yml
---
In a [previous tutorial](/tutorials/dcos-101/app1/), you deployed an application that runs inside the cluster and interacts with another application--the Redis service--that also runs inside the cluster. Neither application is exposed outside of the cluster or available to any external users. This is because DC/OS supports running applications on two different type of nodes: **private agent nodes** and **public agent nodes**. 

So far, you have only worked with applications and services that run on private agent nodes, which cannot be accessed from outside of the cluster. To expose a service or application to the outside world, you typically use a load balancer running on a public node.

In this tutorial, you will deploy another sample application but with a few important differences:
- The new sample application includes a presentation layer that presents a web-based user interface to users who access the application.
- The new sample application uses a native DC/OS container--the Universal Container Runtime (UCR)--that does not rely on a Docker image or the Docker engine, making the application easier to deploy with fewer dependencies and less complexity.
- You will expose the new sample application for access from outside of the cluster by running it on a public agent node with Marathon-LB as the load balancer.

# Before you begin
Before starting this tutorial, you should verify the following:
- You have access to a running [DC/OS cluster](../start-here/) with at least at least one master node and three agent nodes.
- You have access to a computer where the [DC/OS CLI](../cli/) is installed.
- You have the sample [dcos-101/app1](/tutorials/dcos-101/app1/) application deployed and running in your cluster.

# Learning objectives
By completing this tutorial, you will learn:
- How to deploy an app that uses the DC/OS Universal Container Runtime instead of Docker.
- How to make an app available to clients outside of the cluster by running it on a public agent node using a public-facing IP address and the Marathon-LB load balancer.
- How to test access to the new sample app.

# Review the sample application
The [app2](https://github.com/joerg84/dcos-101/blob/master/app2/app2.go) sample application is a [Go-based](https://golang.org/) HTTP server that exposes a simple interface to Redis.

If you review the [app definition](https://raw.githubusercontent.com/joerg84/dcos-101/master/app2/app2.json), you can see that this sample app is a binary without any external dependencies. Because it has no external dependencies, you can deploy it using a DC/OS native Universal Container Runtime (UCR) container.

# Deploy the sample app
1. Deploy the sample application by running the following command:

    ```bash
    dcos marathon app add https://raw.githubusercontent.com/joerg84/dcos-101/master/app2/app2.json
    ```

    Alternatively, you can deploy the sample app from the DC/OS web-based administrative console.
    
1. Verify the new sample app deployed successfully by running the following command to list all DC/OS tasks: 

    ```bash
    dcos task
    ```

    The command returns output similar to the following:

    ```bash
    NAME            HOST        USER  STATE  ID                                                                   MESOS ID                                     REGION          ZONE       
    app2.dcos-101   10.0.1.127  root    R    dcos-101_app2.instance-d86ffa58-8935-11e9-a1c1-4a501e74c1fd._app.1   dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0  aws/us-west-2  aws/us-west-2a
    ```

    You can also verify a successful deployment by running the following command to list all Marathon apps:

    ```bash
    dcos marathon app list
    ID               MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD                       
    /dcos-101/app2   128    1     1/1    N/A       ---      False       N/A     chmod u+x app2 && ./app2  
    ```

1. Test the HTTP server from within the cluster by connecting to the leading master and running the client URL (`cURL`) command:

    ```bash
    dcos node ssh --master-proxy --leader
    curl dcos-101app2.marathon.l4lb.thisdcos.directory:10000
    ```

    The `cURL` command returns the raw HTML response from app2's web server with output similar to the following:

    ```
    <html><title>Welcome to DC/OS 101!</title><body><h1>Welcome to DC/OS 101!</h1><h1>Running on node '10.0.1.127' and port '26962' </h1><h1>Add a new key:value pair</h1><form action="/save" method="POST"><textarea name="key">Key</textarea><br><textarea name="value">Value</textarea><br><input type="submit" value="Save"></form></body></html>
    ```

    Accessing the app from within the cluster and viewing the raw HTML response proves the application is running. For this tutorial, however, you also want to expose the app to the public. In the next part of this tutorial, you will do exactly that.

1. Close session on the master node that you used to view the raw HTML response for the sample app.

# Install the load balancer
Public agent nodes allow inbound access requests from clients outside of the cluster. The public agent is exposed to the outside world through a load balancer. For this tutorial, you will install [Marathon-LB](/services/marathon-lb/) as the load balancer to provide external access for applications running internally in the cluster.

1. Install Marathon-LB by running the following command:

    ```bash
    dcos package install marathon-lb --yes
    ```

1. Verify that Marathon-LB was successfully deployed by running the following command:

    ```bash
    dcos task

    NAME            HOST        USER  STATE  ID                                                                   MESOS ID                                     REGION          ZONE       
    app2.dcos-101   10.0.1.127  root    R    dcos-101_app2.instance-d86ffa58-8935-11e9-a1c1-4a501e74c1fd._app.1   dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0  aws/us-west-2  aws/us-west-2a  
    marathon-lb     10.0.7.218  root    R    marathon-lb.instance-0ffbfc6c-8942-11e9-a1c1-4a501e74c1fd._app.1     dedbb786-feb7-47f2-ae69-27bf86ba53fb-S1  aws/us-west-2  aws/us-west-2a  
    redis-tutorial  10.0.1.127  root    R    redis-tutorial.instance-97dae2d7-8934-11e9-a1c1-4a501e74c1fd._app.1  dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0  aws/us-west-2  aws/us-west-2a
    ``` 

    If your cluster uses a cloud provider such as AWS, the <code>dcos task</code> might show you the private IP address of the host, which is not resolvable from outside the cluster. Using the output from the `dcos task` command, however, you can determine the private IP assigned to the `marathon-lb` task. In this example, the private IP address is 10.0.7.218.

1. Identify the IP address of the public agent node that Marathon-LB is using by running the following command:

    ```bash
    dcos node list
    ```

    The command returns information similar to the following:

    ```
    HOSTNAME         IP       PUBLIC IP(S)                     ID                          TYPE           REGION           ZONE       
    10.0.7.218     10.0.7.218  34.214.200.181  dedbb786-feb7-47f2-ae69-27bf86ba53fb-S1  agent            aws/us-west-2  aws/us-west-2a  
    10.0.1.127     10.0.1.127                  dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0  agent            aws/us-west-2  aws/us-west-2a  
    master.mesos.  10.0.7.173  34.219.206.248  dedbb786-feb7-47f2-ae69-27bf86ba53fb     master (leader)  aws/us-west-2  aws/us-west-2a  
    ```

    From the output for the `dcos node list` command, you can see the public IP address that corresponds with the private IP address where the `marathon-lb` task is running. In this example, the public IP address for the Marathon-LB service is 34.214.200.181.

# Connect using the public IP address
1. Connect to the web app from your local computer using the public IP address and port 10000. For example: `34.214.200.181:10000`. 

    You should see a simple web page form similar to this:

    ![Sample app2 web page](/1.13/img/tutorial-webpage.png)

1. Add a new Key and add a new Value, then click **Save** using the sample app web-based frontend.

1. Verify the total number of keys using the `app1` sample application by running the `dcos task log app1` command.

1. Check Redis directly by running `dcos task`, copying the Mesos ID returned for the Redis service, then opening a secure shell on the node where the Redis service is running. 

    For example, if the `dcos task` output displays  `dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0` for the Redis task `Mesos ID` column, you can connect to the node using:

    ```bash
    dcos node ssh --master-proxy --mesos-id=dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0
    ```
    
    After connecting to the agent node, do the following:    
    - List the Docker containers for the agent using `docker ps`.
    
    - Copy the ContainerID for the Redis task from the output for the `docker ps` command.
    
    - Create a `bash` session in the Docker container using the ContainerID from the previous command:
    
    ```bash
    sudo docker exec -i -t CONTAINER_ID  /bin/bash
    ```
    
    - Start the Redis CLI by running `redis-cli` in the bash shell.
    
    - Check for the key value you added by running the `get <newkey>` command.

# Next steps
Congratulations! You have deployed a sample application that uses the native DC/OS UCR container, used Marathon-LB to expose the application to the public, and tested your publicly-available app by adding a new key to the Redis service using the web frontend.

# Related topics
DC/OS uses [containerizers](/1.13/deploying-services/containerizers/) to run tasks in containers. Running tasks in containers enables you to isolate tasks from each other and control task resources programmatically. DC/OS supports two types of containerizers:

- DC/OS Universal Containerizer Runtime (UCR)
- Docker containerizer

At this point, you have seen how to deploy apps using a Docker image (app1) and using the native Universal Containerizer Runtime (app2).

For your first app, you used a Docker container image to package dependencies so that you didn’t need to rely on particular programs being available on the agent. You then used the Docker containerizer to run the application packaged in the Docker image. Because the Docker containerizer internally uses the [Docker runtime](https://docs.docker.com/engine/userguide/intro/), you also used the Docker runtime.

For your second sample application, you did not have any dependencies. Because there are no external dependencies, you could rely on the default DC/OS Universal Containerizer Runtime. Internally, both containerizer runtimes use the same operating system features--[cgroups](https://en.wikipedia.org/wiki/Cgroups) and [namespaces](https://en.wikipedia.org/wiki/Linux_namespaces) for resource isolation.