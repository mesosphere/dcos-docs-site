---
layout: layout.pug
navigationTitle: Deploy native applications
title: Deploy native applications
excerpt: Deploys an application using the native DC/OS Universal Runtime Container (part 8)
menuWeight: 8
---
In the [previous tutorial](/tutorials/dcos-101/app1/), you deployed an application that runs inside the cluster and interacts only with another application--the Redis service--that runs inside the cluster. Neither application is exposed outside of the cluster or available to any external users. 

In this tutorial, you will deploy another sample application but with a few important differences:
- The new sample application includes a presentation layer that presents a graphical user interface to users to access the applications. 
- You will deploy the new sample application using a native DC/OS container--the Universal Container Runtime (UCR)--that does not rely on a Docker image or the Docker engine, making the application easier to deploy with fewer dependencies and less complexity.

# Before you begin
Before starting this tutorial, you should verify the following:
- You have access to a running [DC/OS cluster](../start-here/) with at least at least one master node and three agent nodes.
- You have access to a computer where the [DC/OS CLI](../cli/) is installed.
- You have the sample [dcos-101/app1](/tutorials/dcos-101/app1/) application deployed and running in your cluster.

# Learning objective
By completing this tutorial, you will learn:
- How to deploy an app with a graphical user interface.
- How to deploy an app using the DC/OS Universal Container Runtime instead of Docker.
- How to test your new sample app.

# Review the sample application
  * Understand the application
    * Take a short look at [app2](https://github.com/joerg84/dcos-101/blob/master/app2/app2.go). App2 is a [Go](https://golang.org/) based HTTP server that exposes a very simple interface to Redis.
  * Deploy app2
    * Take a short look at the [app definition](https://raw.githubusercontent.com/joerg84/dcos-101/master/app2/app2.json). In this case, the app is a binary without external dependencies.
    Because of this, you no longer need to deploy it in a Docker container.

# Deploy the sample app
    * Deploy app2: `dcos marathon app add https://raw.githubusercontent.com/joerg84/dcos-101/master/app2/app2.json`
  * You have multiple options to check app 2 is successfully running:
    * By looking at all DC/OS tasks: `dcos task`
    * By looking at all Marathon apps: `dcos marathon app list`
    * Curl the http server from within the cluster (in this case from the leading master):
       * `dcos node ssh --master-proxy --leader`
       * `curl dcos-101app2.marathon.l4lb.thisdcos.directory:10000`

      This should return you the raw HTML response from app2's webserver.


Accessing the app from within the cluster and viewing the raw HTML response proves our application is running, but in the real world you want to expose the app to the public. In the next part of this tutorial you will do exactly that.

# Next steps
 You have deployed a second app that uses the native Mesos containerizer.

# Related topics
You have now deployed apps in two different ways:

1. Using Docker (app1).
1. Using the native Universal Container Runtime (app2).

Let's explore the differences in some more detail.

DC/OS uses [containerizers](/deploying-services/containerizers/) to run tasks in containers. Running tasks in containers offers a number of benefits, including the ability to isolate tasks from one another and control task resources programmatically. DC/OS supports two types of containerizers - the DC/OS Universal Container Runtime, and the Docker containerizer.

For your first app, you used a Docker container image to package app1's dependencies ( Remember: never rely on dependencies being installed on an agent! ) and then used the Docker containerizer to execute it. Because the Docker containerizer internally uses the [Docker runtime](https://docs.docker.com/engine/userguide/intro/), you also used the Docker runtime.

For your second app, you did not have any dependencies and therefore could rely on the default DC/OS Universal Container Runtime. Internally, both runtimes use the same OS features for isolation, namely [cgroups](https://en.wikipedia.org/wiki/Cgroups) and [namespaces](https://en.wikipedia.org/wiki/Linux_namespaces).
This actually makes it possible to use the DC/OS Universal Container Runtime for running Docker images - check the [DC/OS Universal Container Runtime](/deploying-services/containerizers/) documentation for details.
