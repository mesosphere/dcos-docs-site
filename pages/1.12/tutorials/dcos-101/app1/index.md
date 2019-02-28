---
layout: layout.pug
navigationTitle:  Deploying First Application
excerpt: Part 3 of the DC/OS 101 Tutorial
title: Tutorial - Deploying First Application
menuWeight: 3
---

#include /include/tutorial-disclaimer.tmpl

Welcome to part 3 of the DC/OS 101 Tutorial


# Prerequisites
* A [running DC/OS cluster](/1.12/tutorials/dcos-101/cli/) with [the DC/OS CLI installed](/1.12/tutorials/dcos-101/cli/).
* [Redis](/1.12/tutorials/dcos-101/redis-package/) deployed and running in your cluster.


# Objective
You now have a working persistence layer - [Redis](https://redislabs.com/) - running in your cluster.
In this section you will deploy a simple app connecting to Redis.

# Steps
1. Let us first take a short look at the [app](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.py). It is very simple and just checks whether it can reach Redis and then prints the total number of keys stored there.

    ```python
    import os
    import redis
    import time

    print("Running on node '"+  os.getenv("HOST") + "' and port '" + os.getenv("PORT0"))
    r = redis.StrictRedis(host='redis.marathon.l4lb.thisdcos.directory', port=6379, db=0)
    if r.ping():
            print("Redis Connected. Total number of keys:", len(r.keys()))
    else:
            print("Could not connect to redis")
    time.sleep(5)
    ```
1. The Python script has a dependency on the [redis-py](https://pypi.python.org/pypi/redis) Python library, which you cannot assume to be present on all agent nodes. Because of this, you should run it in the `mesosphere/dcos-101` Docker container that provides all of the dependencies. Feel free to take a look at the [DOCKERFILE](https://github.com/joerg84/dcos-101/blob/master/app1/DOCKERFILE), which was used to create the `mesosphere/dcos-101` image.

    Have a look at the [app definition](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.json). The app definition is the configuration which Marathon will use to deploy and manage the application. This app definition will download the python script and then run it inside the `mesosphere/dcos-101` Docker container.
1. Add `app1` to Marathon using the app definition: 
  
    ```bash
    dcos marathon app add https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.json
    ```
1. Check that `app1` is running 

  * By looking at all DC/OS tasks: 

    ```
    dcos task
    ```
    Here you should look at the state this task is currently in, which probably is either `staging` or `running`.
      
  * By looking at all Marathon apps:

    ```
    dcos marathon app list
    ```

  * By checking the logs: 

    ```
    dcos task log app1
    ```
    Here you should see which node and port `app1` is running on, and the output from the app showing the number of keys in Redis. The node and ports  might vary between different runs and even during the lifetime of the app, depending on events in the cluster.

# Outcome
- You have deployed your first app inside a Docker container using Marathon.
- You have verified that the app is running and successfully connected to the previously deployed Redis service.

# Deep Dive
You have just deployed your first app using [Marathon](https://mesosphere.github.io/marathon/) directly. Also note that the Redis service itself is running via Marathon.

Marathon is referred to as the init system of DC/OS, as its main job is to support long running services.
Marathon also allows for scaling or uninstalling of applications.
There are multiple options to deploy and maintain apps on Marathon besides the DC/OS GUI:

* DC/OS CLI: You have just used this option to deploy your app. To get more information on the marathon CLI use `dcos marathon app --help`.
* HTTP endpoints: Marathon also comes with an extensive [REST API](http://mesosphere.github.io/marathon/api-console/index.html)

In [the next section](/1.12/tutorials/dcos-101/service-discovery/), you will learn about DC/OS service discovery by exploring the different options available for apps in DC/OS.