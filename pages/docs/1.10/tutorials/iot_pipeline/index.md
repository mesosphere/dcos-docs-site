---
layout: layout.pug
navigationTitle:  Deploying a Load-Balanced Data Pipeline
title: Deploying a Load-Balanced Data Pipeline
menuWeight: 1
excerpt:
featureMaturity:
---

In this tutorial you install and deploy a containerized Ruby on Rails app named Tweeter. Tweeter is an app similar to Twitter that you can use to post 140-character messages to the internet. Then, you use Zeppelin to perform real-time analytics on the data created by Tweeter.
 
<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>Important:</b> Mesosphere does not support this tutorial, associated scripts, or commands, which are provided without warranty of any kind. The purpose of this tutorial is to demonstrate capabilities, and may not be suited for use in a production environment. Before using a similar solution in your environment, you must adapt, validate, and test.</td> </tr> </table>

# Overview

This tutorial demonstrates how you can build a complete load-balanced data pipeline on DC/OS in about 15 minutes! You will learn:

*   How to install DC/OS services.
*   How to add apps to DC/OS Marathon.
*   How to route public traffic to the private application with Marathon-LB.
*   How your apps are discovered.
*   How to scale your apps.

This tutorial uses DC/OS to launch and deploy these microservices to your cluster:

### Cassandra
The [Cassandra][1] database is used on the backend to store the Tweeter app data. 

### Kafka
The [Kafka][2] publish-subscribe message service receives tweets from Cassandra and routes them to Zeppelin for real-time analytics.

### Marathon-LB
[Marathon-LB][12] is an HAProxy based load balancer for Marathon only. It is useful when you require external routing or layer 7 load balancing features.

### Zeppelin
[Zeppelin][4] is an interactive analytics notebook that works with DC/OS Spark on the backend to enable interactive analytics and visualization. Because it's possible for Spark and Zeppelin to consume all of your cluster resources, you must specify a maximum number of cores for the Zeppelin service.

### Tweeter
Tweeter stores tweets in the DC/OS Cassandra service, streams tweets to the DC/OS Kafka service in real-time, and performs real-time analytics with the DC/OS [Spark][3] and Zeppelin services.

The following graphic illustrates the data flow:

![data flow](/docs/1.10/img/lb-data-pipeline.png)

# OSS DC/OS procedure

## Prerequisites

*  [DC/OS](/docs/1.10/installing/oss/) installed with at least 5 [private agents][6] and 1 [public agent][6].
*  [DC/OS CLI](/docs/1.10/cli/install/) installed.
*  The public IP address of your public agent node. After you have installed DC/OS with a public agent node declared, you can [navigate to the public IP address][9] of your public agent node.
*   Git:
    *   **macOS:** Get the installer from [Git downloads](http://git-scm.com/download/mac).
    *   **Unix/Linux:** See these [installation instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Install DC/OS services
From the DC/OS web interface [**Catalog**](/docs/1.10/gui/#catalog) tab, install Cassandra, Kafka, Marathon-LB, and Zeppelin.

__Tip:__ You can also install DC/OS packages from the DC/OS CLI with the [`dcos package install`][11] command.

1.  Find and click the **cassandra** package, click the **DEPLOY** button, and accept the default installation. Cassandra spins up to 3 nodes. Click **GO TO SERVICE**.
1.  Click the **Catalog** tab. Find and click the **kafka** package and click the **DEPLOY** button. Kafka spins up 3 brokers. Click **GO TO SERVICE**.
1.  Click the **Catalog** tab. Find and click the **marathon-lb** package and click the **DEPLOY** button.
1.  Click the **Catalog** tab. Click the **zeppelin** package and click the **CONFIGURE** button.
    1.  Click the **spark** tab and set `cores_max` to `8`.
    1.  Click **REVIEW AND DEPLOY** and click **DEPLOY**. Click **GO TO SERVICE**.
1.  Click the **Services** tab to watch as your microservices are deployed on DC/OS. You will see the Health status go from Idle to Unhealthy, and finally to Healthy as the nodes come online. This may take several minutes.

    **Tip:** It can take up to 10 minutes for Cassandra to initialize with DC/OS because of race conditions.

    ![Services tab with all services shown.](/docs/1.10/img/tweeter-services6.png)

## Deploy the containerized app

In this step you deploy the containerized Tweeter app to a public node.

1.  Navigate to the [Tweeter](https://github.com/mesosphere/tweeter/) GitHub repository and save the `/tweeter/tweeter.json` Marathon app definition file.

1.  Add the `HAPROXY_0_VHOST` definition with the public IP address of your [public agent][9] node to your `tweeter.json` file.

    **Important:** You must remove the leading `http://` and the trailing `/`.

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
        "HAPROXY_0_VHOST": "joel-ent-publicsl-e7wjol669l9f-741498241.us-west-2.elb.amazonaws.com"
      }
    ...
    ```

4.  Install and deploy Tweeter to your DC/OS cluster.

    ```bash
    dcos marathon app add tweeter.json
    ```

    **Tip:** The `instances` parameter in `tweeter.json` specifies the number of app instances. Use the following command to scale your app up or down:

    ```bash
    dcos marathon app update tweeter instances=<number_of_desired_instances>
    ```

    The service talks to Cassandra via `node-0.cassandra.mesos:9042`, and Kafka via `broker-0.kafka.mesos:9557` in this example. Traffic is routed via Marathon-LB because of the `HAPROXY_0_VHOST` definition in the `tweeter.json` app definition file.

1.  Go to the **Services** tab to verify your app is up and healthy.

    ![Tweeter deployed](/docs/1.10/img/tweeter-services7.png)

1.  Navigate to [public agent][9] node endpoint to see the Tweeter UI and post a tweet.

    ![Tweeter][14]

## Post 100K Tweets

Deploy the post-tweets containerized app to see DC/OS load balancing in action. This app automatically posts a large number of tweets from Shakespeare. The app will post more than 100k tweets one by one, so you'll see them coming in steadily when you refresh the page.

1.  Navigate to the [Tweeter](https://github.com/mesosphere/tweeter/) GitHub repository and save the `tweeter/post-tweets.json` Marathon app definition file.

1.  Deploy the `post-tweets.json` Marathon app definition file.

    ```bash
    dcos marathon app add post-tweets.json
    ```

1.  After the `post-tweets.json` is running:

    *  Refresh your browser to see the incoming Shakespeare tweets.

       ![Shakespeare tweets](/docs/1.10/img/tweeter-shakespeare.png)

The post-tweets app works by streaming to the VIP `1.1.1.1:30000`. This address is declared in the `cmd` parameter of the `post-tweets.json` app definition.

```json

  "id": "/post-tweets",
  "cmd": "bin/tweet shakespeare-tweets.json http://1.1.1.1:30000",
...
```

The Tweeter app uses the service discovery and load balancer service that is installed on every DC/OS node. This address is defined in the `tweeter.json` definition `VIP_0`.

```bash
...
  "containerPort": 3000,
  "hostPort": 0,
  "servicePort": 10000,
  "labels": {
    "VIP_0": "1.1.1.1:30000"
}
...
```

# Enterprise DC/OS procedure

## Prerequisites

*  [Enterprise DC/OS](/docs/1.10/installing/ent/) installed with:
    - Security [mode](/docs/1.10/installing/custom/configuration/configuration-parameters/#security) set to permissive or strict. By default, DC/OS installs in permissive security mode.
    - Minimum 5 [private agents][6] and 1 [public agent][6].
*  [DC/OS CLI](/docs/1.10/cli/install/) installed.
*  The public IP address of your public agent node. After you have installed DC/OS with a public agent node declared, you can [navigate to the public IP address][9] of your public agent node.
*   Git:
    *   **OS X:** Get the installer from [Git downloads](http://git-scm.com/download/mac).
    *   **Unix/Linux:** See these [installation instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Install DC/OS services

From the DC/OS web interface [**Catalog**](/docs/1.10/gui/#catalog) tab, install Cassandra, Kafka, and Zeppelin.

__Tip:__ You can also install DC/OS packages from the DC/OS CLI with the [`dcos package install`][11] command.

1.  Find and click the **cassandra** package, click the **DEPLOY** button, and accept the default installation. Cassandra spins up to 3 nodes. Click **GO TO SERVICE**.
1.  Click the **Catalog** tab. Find and click the **kafka** package and click the **DEPLOY** button. Kafka spins up 3 brokers. Click **GO TO SERVICE**.
1.  Click the **Catalog** tab. Click the **zeppelin** package and click the **CONFIGURE** button.
    1.  Click the **spark** tab and set `cores_max` to `8`.
    1.  Click **REVIEW AND DEPLOY** and click **DEPLOY**. Click **GO TO SERVICE**.
1.  Click the **Services** tab to watch as your microservices are deployed on DC/OS. You will see the Health status go from Idle to Unhealthy, and finally to Healthy as the nodes come online. This may take several minutes.
1.  Install Marathon-LB.

     1.  Install the security CLI (`dcos-enterprise-cli`) by using the DC/OS CLI package install commands. You will use this to partially configure the Marathon-LB security.

         1.  Search for the security CLI package repository by using the `dcos package search` command. In this example the partial value `enterprise*` is used as an argument.

             ```bash
             dcos package search enterprise*
             ```

             Here is the output:

             ```bash
             NAME                 VERSION  SELECTED  FRAMEWORK  DESCRIPTION
             dcos-enterprise-cli  1.0.7    False     False      Enterprise DC/OS CLI
             ```

         1.  Install the security CLI package.

             ```bash
             dcos package install dcos-enterprise-cli
             ```

             Here is the output:

             ```bash
             Installing CLI subcommand for package [dcos-enterprise-cli] version [1.0.7]
             New command available: dcos security
             ```

     1.  Configure service authentication for [Marathon-LB](/docs/1.10/networking/marathon-lb/mlb-auth/).

          1.  Create a public-private key pair by using the security CLI.

              ```bash
              dcos security org service-accounts keypair private-key.pem public-key.pem
              ```

          1.  Create a new service account with the ID `marathon-lb-service-acct`. This command uses the `public-key.pem` created in the previous step.

              ```bash
              dcos security org service-accounts create -p public-key.pem -d "Marathon-LB service account" marathon-lb-service-acct
              ```

          1.  Create a new secret (`marathon-lb-secret`) using the private key (`private-key.pem`) and the name of the service account (`marathon-lb-service-acct`).

              ```bash
              dcos security secrets create-sa-secret private-key.pem marathon-lb-service-acct marathon-lb-secret
              ```

              You can verify that the secret was created successfully with this command.

              ```bash
              dcos security secrets list /
              ```

              You should see output similar to this:

              ```bash
              - marathon-lb-secret
              ```

      1.  Grant the Marathon-LB permissions and the allowed action to the service account using the CLI.

          ```bash
          dcos security org users grant marathon-lb-service-acct dcos:service:marathon:marathon:services:/ read --description "Allows access to any service launched by the native Marathon instance"
          dcos security org users grant marathon-lb-service-acct dcos:service:marathon:marathon:admin:events read --description "Allows access to Marathon events"
          ```

      1.  Install the Marathon-LB package by using the DC/OS CLI.

          1.  Create a `config.json` Marathon app definition file with these contents. A Marathon app definition file specifies the required parameters for launching a containerized app with Marathon.

              ```bash
              {
                  "marathon-lb": {
                      "secret_name": "marathon-lb-secret"
                  }
              }
              ```

          1.  Install Marathon-LB from the DC/OS CLI with the `config.json` file specified.

              ```bash
              dcos package install --options=config.json marathon-lb
              ```

2.  Monitor the **Services** tab to watch as your microservices are deployed on DC/OS. You will see the Health status go from Idle to Unhealthy, and finally to Healthy as the nodes come online. This may take several minutes.

    ![Services tab with all services shown.](/docs/1.10/img/tweeter-services6-ee.png)

**Note:** It can take up to 10 minutes for Cassandra to initialize with DC/OS because of race conditions.

## Deploy the containerized app

In this step you deploy the containerized Tweeter app to a public node.

1.  Navigate to the [Tweeter](https://github.com/mesosphere/tweeter/) GitHub repository and save the `/tweeter/tweeter.json` Marathon app definition file.

1.  Add the `HAPROXY_0_VHOST` definition with the public IP address of your [public agent][9] node to your `tweeter.json` file.

    **Important:** You must remove the leading `http://` and the trailing `/`.

    ```json
    ...
      ],
      "labels": {
        "HAPROXY_GROUP": "external",
        "HAPROXY_0_VHOST": "<public-agent-IP>"
      }
    }
    ```

    In this example, a DC/OS cluster is running on AWS:

    ```bash
    ...
      ],
      "labels": {
        "HAPROXY_GROUP": "external",
        "HAPROXY_0_VHOST": "joel-ent-publicsl-e7wjol669l9f-741498241.us-west-2.elb.amazonaws.com"
      }
    }
    ```

4.  Install and deploy Tweeter to your DC/OS cluster with this CLI command.

    ```bash
    dcos marathon app add tweeter.json
    ```

    **Tip:** The `instances` parameter in `tweeter.json` specifies the number of app instances. Use the following command to scale your app up or down:

    ```bash
    dcos marathon app update tweeter instances=<number_of_desired_instances>
    ```

    The service talks to Cassandra via `node-0.cassandra.mesos:9042`, and Kafka via `broker-0.kafka.mesos:9557` in this example. Traffic is routed via Marathon-LB because of the `HAPROXY_0_VHOST` definition in the `tweeter.json` app definition file.

1.  Go to the **Services** tab to verify your app is up and healthy.

    ![Tweeter deployed](/docs/1.10/img/tweeter-services7-ee.png)

1.  Navigate to [public agent][9] node endpoint to see the Tweeter UI and post a tweet!

    ![Tweeter][14]

    **Tip:** If you're having trouble, verify the `HAPROXY_0_VHOST` value in the `tweeter.json` file.

## Post 100K Tweets
Deploy the post-tweets containerized app to see DC/OS load balancing in action. This app automatically posts a large number of tweets from Shakespeare. The app will post more than 100k tweets one by one, so you'll see them coming in steadily when you refresh the page.

1.  Navigate to the [Tweeter](https://github.com/mesosphere/tweeter/) GitHub repository and save the `tweeter/post-tweets.json` Marathon app definition file.

1.  Deploy the `post-tweets.json` Marathon app definition file.

    ```bash
    dcos marathon app add post-tweets.json
    ```

1.  After the `post-tweets.json` is running:

    *  Refresh your browser to see the incoming Shakespeare tweets.

       ![Shakespeare tweets](/docs/1.10/img/tweeter-shakespeare.png)

    *  Click the **Networking** -> **Service Addresses** tab in the DC/OS web interface and select the `1.1.1.1:30000` virtual network to see the load balancing in action.

       ![Tweeter scaled](/docs/1.10/img/tweeter-services8-ee.png)

The post-tweets app works by streaming to the VIP `1.1.1.1:30000`. This address is declared in the `cmd` parameter of the `post-tweets.json` app definition.

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

# Enterprise and OSS DC/OS

## Add Streaming Analytics

Next, you'll perform real-time analytics on the stream of tweets coming in from Kafka.

1. Navigate to Zeppelin at `https://<master_ip>/service/zeppelin/`.
   
   **Tip:** Your master IP address is the URL of the DC/OS web interface.
2. Click **Import Note** and import `tweeter-analytics.json`. Zeppelin is preconfigured to execute Spark jobs on the DC/OS cluster, so there is no further configuration or setup required. Be sure to use `https://`, not `http://`.

2.  Navigate to **Notebook** -> **Tweeter Analytics**.

3.  Run the **Load Dependencies** step to load the required libraries into Zeppelin.

4.  Run the **Spark Streaming** step, which reads the tweet stream from ZooKeeper and puts them into a temporary table that can be queried using SparkSQL.

5.  Run the **Top tweeters** SQL query, which counts the number of tweets per user using the table created in the previous step. The table updates continuously as new tweets come in, so re-running the query produces a different result every time.

    ![Top Tweeters][16]

 [1]: /service-docs/cassandra/
 [2]: /service-docs/kafka/
 [3]: /service-docs/spark/
 [4]: http://zeppelin.apache.org/
 [5]: https://github.com/mesosphere/marathon-lb
 [6]: /docs/1.10/overview/concepts/
 [7]: /docs/1.10/installing/cloud/
 [8]: /docs/1.10/installing/custom/
 [9]: /docs/1.10/administering-clusters/locate-public-agent/
 [10]: /docs/1.10/img/webui-universe-install.png
 [11]: /docs/1.10/cli/command-reference/
 [12]: /docs/1.10/networking/marathon-lb/
 [13]: https://github.com/mesosphere/tweeter
 [14]: /docs/1.10/img/tweeter.png
 [15]: /docs/1.10/img/network-tab.png
 [16]: /docs/1.10/img/top-tweeters.png
