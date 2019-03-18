---
layout: layout.pug
navigationTitle:  Deploying a Load-Balanced Data Pipeline
title: Deploying a Load-Balanced Data Pipeline
menuWeight: 3
excerpt: Tutorial - Building a complete load-balanced data pipeline on DC/OS

---

#include /include/tutorial-disclaimer.tmpl

This tutorial demonstrates how you can build a complete load-balanced data pipeline on DC/OS in about 15 minutes!

# Overview

In this tutorial you will install and deploy a containerized Ruby on Rails app named Tweeter. Tweeter is an app similar to Twitter that you can use to post 140-character messages to the internet. Then, you use Zeppelin to perform real-time analytics on the data created by Tweeter.

You will learn:

*   How to install DC/OS services
*   How to add apps to DC/OS Marathon
*   How to route public traffic to the private application with Marathon-LB
*   How your apps are discovered
*   How to scale your apps

This tutorial uses DC/OS to launch and deploy these microservices to your cluster:

### Cassandra
The [Cassandra][1] database is used on the back-end to store the Tweeter app data.

### Kafka
The [Kafka][2] publish-subscribe message service receives tweets from Cassandra and routes them to Zeppelin for real-time analytics.

### Marathon-LB
[Marathon-LB][12] is an HAProxy based load balancer for Marathon only. It is useful when you require external routing or layer 7 load balancing features.

### Zeppelin
[Zeppelin][4] is an interactive analytics notebook that works with DC/OS Spark on the back-end to enable interactive analytics and visualization. Because it is possible for Spark and Zeppelin to consume all of your cluster resources, you must specify a maximum number of cores for the Zeppelin service.

### Tweeter
Tweeter stores tweets in the DC/OS Cassandra service, streams tweets to the DC/OS Kafka service in real-time, and performs real-time analytics with the DC/OS [Spark][3] and Zeppelin services.

# Prepare and deploy Tweeter on DC/OS Cluster

## Prerequisites

*  [DC/OS](/latest/installing/) or [DC/OS Enterprise](/latest/installing/) installed with at least 5 [private agents][6] and 1 [public agent][6].
*  [DC/OS CLI](/cli/install/) installed.
*  The public IP address of your public agent node. After you have installed DC/OS with a public agent node declared, you can [navigate to the public IP address][9] of your public agent node.
*   Git:
    *   **macOS:** Get the installer from [Git downloads](http://git-scm.com/download/mac).
    *   **Unix/Linux:** See these [installation instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Install DC/OS services

In this step you install Cassandra, Kafka, Marathon-LB, and Zeppelin from the DC/OS web interface [**Catalog**](/gui/catalog/) tab. You can also install DC/OS packages from the DC/OS CLI with the [`dcos package install`][11] command.

1.  Find and click the **cassandra** package, click **REVIEW & RUN**, and accept the default installation, by clicking **REVIEW & RUN** again, then **RUN SERVICE**. Cassandra spins up to 3 nodes. When prompted by the modal alert, click **OPEN SERVICE**.

2.  Click the **Catalog** tab. Find and click the **kafka** package, click the **REVIEW & RUN** button, then again, then **RUN SERVICE**. Kafka spins up 3 brokers. When prompted by the modal alert, click **OPEN SERVICE**.

3.  Click the **Catalog** tab. Find and click the **marathon-lb** package, click the **REVIEW & RUN** button, then again, then **RUN SERVICE**. When prompted by the modal alert, click **OPEN SERVICE**.

If you are having trouble getting Marathon-LB up and running on an Enterprise cluster, try installing it following [these instructions](/services/marathon-lb/mlb-install/). Depending on your [security mode](/security/ent/#security-modes), Marathon-LB may require service authentication for access to DC/OS.

4.  Click the **Catalog** tab. Click the **zeppelin** package, then click the **REVIEW & RUN** button.
    1.  Click the **spark** tab on the left and set `cores_max` to `8`.
    2.  Click **REVIEW AND RUN** and click **RUN**. Click **OPEN SERVICE**.

5.  Click the **Services** tab to watch as your microservices are deployed on DC/OS. You will see the Health status go from Idle to Unhealthy, and finally to Healthy as the nodes come online. This may take several minutes.

    ![Services tab with all services shown.](/img/tweeter-services6-ee.png)

    Figure 1. Services tab showing Tweeter services

## Deploy the containerized app

In this step you deploy the containerized Tweeter app to a public node.

1.  Navigate to the [Tweeter](https://github.com/mesosphere/tweeter/) GitHub repository and save the `/tweeter/tweeter.json` Marathon app definition file.

2.  Add the `HAPROXY_0_VHOST` definition with the public IP address of your [public agent][9] node to your `tweeter.json` file.

    <table class=“table” bgcolor=#858585>
    <tr>
    <td align=justify style=color:white><strong>Important:</strong> You must remove the leading "http://" and the trailing "/".
    </td>
    </tr>
    </table>

    ```json
    ...
      ],
      "labels": {
        "HAPROXY_GROUP": "external",
        "HAPROXY_0_VHOST": "<public-agent-IP>"
      }
    ...
    ```

    In this example, a DC/OS cluster is running on AWS:

    ```bash
    ...
      ],
      "labels": {
        "HAPROXY_GROUP": "external",
        "HAPROXY_0_VHOST": "52.34.136.22"
      }
    ...
    ```

3.  Navigate to the directory that includes your modified `tweeter.json` file. Install and deploy Tweeter to your DC/OS cluster.

    ```bash
    dcos marathon app add tweeter.json
    ```

    The `instances` parameter in `tweeter.json` specifies the number of app instances. Use the following command to scale your app up or down:

    ```bash
    dcos marathon app update tweeter instances=<number_of_desired_instances>
    ```

    The service talks to Cassandra via cluster node `node-0.cassandra.mesos:9042`, and Kafka via cluster node `broker-0.kafka.mesos:9557`, in this example. Traffic is routed via Marathon-LB because of the `HAPROXY_0_VHOST` definition in the `tweeter.json` app definition file.

4.  Go to the **Services** tab to verify your app is up and healthy.

    ![Tweeter deployed](/img/tweeter-services7.png)

    Figure 2. Tweeter deployed

5.  Navigate to the [public agent][9] node endpoint to see the Tweeter UI and post a tweet. In this example, you would point the browser at `52.34.136.22`.

    ![Tweeter][14]

    Figure 3. "Hello world" tweet

## Post 100K tweets

In this step you deploy an app that automatically posts a large number of tweets from Shakespeare. The app will post more than 100k tweets one by one, so you'll see them coming in steadily when you refresh the page.

1.  Navigate to the [Tweeter](https://github.com/mesosphere/tweeter/) GitHub repository and save the `tweeter/post-tweets.json` Marathon app definition file.

2.  Deploy the `post-tweets.json` Marathon app definition file.

    ```bash
    dcos marathon app add post-tweets.json
    ```

3.  After the `post-tweets.json` is running, refresh your browser to see the incoming Shakespeare tweets.

    ![Shakespeare tweets](/img/tweeter-shakespeare.png)

    Figure 4. Shakespeare tweets

The `post-tweets` app works by streaming to the VIP `1.1.1.1:30000`. This address is declared in the `cmd` parameter of the `post-tweets.json` app definition.

```json
{
  "id": "/post-tweets",
  "cmd": "bin/tweet shakespeare-tweets.json http://1.1.1.1:30000",
...
}
```

The Tweeter app uses the service discovery and load balancer service that is installed on every DC/OS node. This address is defined in the `tweeter.json` definition `VIP_0`.

```json
...
{
  "containerPort": 3000,
  "hostPort": 0,
  "servicePort": 10000,
  "labels": {
    "VIP_0": "1.1.1.1:30000"
    }
}
...
```

If you are using a DC/OS Enterprise cluster, click the **Networking** -> **Service Addresses** tab in the DC/OS web interface and select the `1.1.1.1:30000` virtual network to see the load balancing in action:

![Tweeter scaled](/1.13/img/tweeter-services8-ee.png)

Figure 5. Scaled tweets

## Add streaming analytics

In this last step, youv will perform real-time analytics on the stream of tweets coming in from Kafka.

1. Navigate to the [Tweeter](https://github.com/mesosphere/tweeter/) GitHub repository and save the `tweeter/post-tweets.json` Marathon app definition file.

2. Navigate to Zeppelin at `https://<master_ip>/service/zeppelin/`.  Your master IP address is the URL of the DC/OS web interface.

3. Click **Import Note** and import `tweeter-analytics.json`. Zeppelin is preconfigured to execute Spark jobs on the DC/OS cluster, so there is no further configuration or setup required. Be sure to use `https://`, not `http://`.

4.  Navigate to **Notebook** -> **Tweeter Analytics**.

5.  Run the **Load Dependencies** step to load the required libraries into Zeppelin.

6.  Run the **Spark Streaming** step, which reads the tweet stream from ZooKeeper and puts them into a temporary table that can be queried using SparkSQL.

6.  Run the **Top tweeters** SQL query, which counts the number of tweets per user using the table created in the previous step. The table updates continuously as new tweets come in, so re-running the query produces a different result every time.

![Top Tweeters][16]

Figure 6. Top Tweeters



 [1]: /services/cassandra/
 [2]: /services/kafka/
 [3]: /services/spark/
 [4]: http://zeppelin.apache.org/
 [5]: https://github.com/mesosphere/marathon-lb
 [6]: /1.13/overview/concepts/
 [9]: /1.13/administering-clusters/locate-public-agent/
 [11]: /1.13/cli/command-reference/
 [12]: /services/marathon-lb/
 [13]: https://github.com/mesosphere/tweeter
 [14]: /1.13/img/tweeter.png
 [16]: /1.13/img/top-tweeters.png
