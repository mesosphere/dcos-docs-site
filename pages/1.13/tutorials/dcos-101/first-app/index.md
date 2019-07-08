---
layout: layout.pug
navigationTitle:  Deploy the first application
title: Deploy the first application
excerpt: Describes how to define and deploy a sample service instance on the cluster (part 4)
menuWeight: 4
render: mustache
model: /1.13/data.yml
---
Now that you are familiar with how to search for and install services from the DC/OS package repository, you are ready to start deploying applications that use the service.

This tutorial demonstrates how you can deploy a simple application that connects to the [Redis](https://redislabs.com/) service you deployed in the previous tutorial.

# Before you begin
Before starting this tutorial, you should verify the following:
- You have access to a running [DC/OS cluster](../start-here/) with at least at least one master node and three agent nodes.
- You have access to a computer where the [DC/OS CLI](../cli/) is installed.
- You have the [Redis](/1.13/tutorials/dcos-101/redis-package/) package installed and the Redis service running in your cluster.

The sample application in this tutorial has some dependencies on external libraries. To ensure you can complete the tutorial, you should download the Docker image for the sample app. The Docker image provided includes all of the necessary files so that you don't need to download any additional libraries or resolve external dependencies.

# Learning objectives
By completing this tutorial, you will learn:
- How to deploy a simple app definition that connects to the Redis service.
- How to check the status of your sample app.

# Review the sample app definition
For this tutorial, you are going to deploy a very simple [sample app](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.py) that checks whether a connection to the Redis service is available, then prints the total number of keys stored there.

The sample app is a Python script has a dependency on the [redis-py](https://pypi.python.org/pypi/redis) Python library. Because of this dependency and that you cannot assume the required library will be present on all agent nodes, you should run the sample app using the `dcos-101` Docker container that provides all of the dependencies.

You might also want to review:
- The [DOCKERFILE](https://github.com/joerg84/dcos-101/blob/master/app1/DOCKERFILE), used to create the `dcos-101` image.
- The [app definition](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.json) used to deploy and manage the application. This app definition downloads the sample app Python script and runs it inside the `dcos-101` container. 

# Deploy the sample app
1. Add the sample app to Marathon using the app definition by running the following command:

    ```bash
    dcos marathon app add https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.json
    ```

1. Check that the sample app is running.

    From the DC/OS web-based console:
    - Click **Services**.
    ![Viewing the sample app in the list of services](/1.13/img/tutorial-dcos101-app1-service.png)

    - Click **dcos-101**.
    ![Viewing app1 information](/1.13/img/tutorial-app1-view.png)
    
    - Click **app1**.
    ![Viewing task information](/1.13/img/tutorial-app1-tasks.png)

    From the DC/OS CLI:
    - View the status for all DC/OS tasks by running: `dcos task`
    - View information for all Marathon apps by running: `dcos marathon app list`
    - View log information for the app by running: `dcos task log app1`
    
    The output from the `dcos task log app1` command indicates the node and port where the **app1** sample application is running, the status of the connection to Redis, and the number of keys you have stored in the Redis service.

    For example:

    ```
    Running on node '10.4.6.52' and port '6512
    Redis Connected. Total number of keys: 2
    ```

    Keep in mind that the node and port information might vary between different runs and over the lifetime of the deployed app, depending on other events in the cluster. How DC/OS locates service instances running on different nodes and using different ports is covered in a later section.

# Next steps
In this tutorial, you deployed your first app inside a Docker container using Marathon and verified that the app is running and that it can connect successfully to the previously-deployed Redis service.

Taken together, these two tutorials represent a common scenario in which you deploy a backend service such as Redis or MySQL, then deploy apps that connect to that service to perform specific tasks such as reporting the number of keys stored in the Redis service or presenting the results of a query in a dashboard.

The next tutorials explore additional deployment tasks that you can perform and expose additional components of the DC/OS architecture:
- [Create and deploy your own apps](../create-service/)
- [Discover deployed services](../service-discovery/)
- [Deploy native containerized applications](../native-app/)
- [Schedule tasks to run as jobs](../schedule-jobs/)

# Related topics
You have now deployed the Redis service and a predefined sample app using [Marathon](https://mesosphere.github.io/marathon/). 

Marathon is a core component of the DC/OS platform. Marathon enables the DC/OS cluster to better support long-running services and is used to perform several key operations, including scaling up or down the number of app instances, modifying resource requires or configuration details, and deploying or removing applications from the cluster.

For more information about working with Marathon, see the following topics:
- [Deploying services and pods](https://docs.mesosphere.com/1.13/deploying-services/) for informaiton about using Marathon to manage your processes, services, and multiple service pods.
- [DC/OS CLI Marathon plugin](https://docs.mesosphere.com/1.13/cli/command-reference/dcos-marathon/) for information about using DC/OS CLI commands for Marathon. You can also get more information about `dcos marathon` commands by typing `dcos marathon app --help` in a terminal shell.
- [REST API](http://mesosphere.github.io/marathon/api-console/index.html) for information about using HTTP endpoints. 
