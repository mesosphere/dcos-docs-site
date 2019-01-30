---
layout: layout.pug
navigationTitle:  Quick Start
title: Quick Start
menuWeight: 0
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kafka-service -->


This tutorial will get you up and running in minutes with Kafka. You will install the DC/OS Kafka service and produce and consume data.
 
**Prerequisites:**

-  [DC/OS and DC/OS CLI installed](/1.9/installing/) with a minimum of four agent nodes.
-  Depending on your [security mode](/1.9/security/ent/#security-modes/), Kafka requires service authentication for access to DC/OS. For more information, see [Configuring DC/OS Access for Kafka](/services/kafka/kafka-auth/).

   | Security mode | Service Account |
   |---------------|-----------------------|
   | Disabled      | Not available   |
   | Permissive    | Optional   |
   | Strict        | Required |

1.  Install the Kafka package. This may take a few minutes. 
    
    ```bash
    dcos package install kafka
    ```      
    
    **Tip:** Type `dcos kafka` to view the Kafka CLI options.

1.  Create a new topic (`topic1`).
    
    ```bash
    dcos kafka topic create topic1
    ```    
    
    The output should resemble:
    
    ```bash
    {
      "message": "Output: Created topic \"topic1\".\n"
    }
    ```

1.  View the connection information.
    
    ```bash
    dcos kafka connection
    ```
    
    The output should resemble the following, where you can see the virtual network, ZooKeeper, brokers, and host IPs:
    
    ```json
    {
      "address": [
        "10.0.1.147:9344",
        "10.0.1.208:9312",
        "10.0.3.71:9826"
      ],
      "zookeeper": "master.mesos:2181/dcos-service-kafka",
      "dns": [
        "broker-0.kafka.mesos:9344",
        "broker-1.kafka.mesos:9312",
        "broker-2.kafka.mesos:9826"
      ],
      "vip": "broker.kafka.l4lb.thisdcos.directory:9092"
    }
    ```
        

1.  Produce and consume data.

    1.  [SSH](/1.9/administering-clusters/sshcluster/) to the leading master node.
    
        ```bash
        dcos node ssh --master-proxy --leader
        ```
        
    1.  Pull the Kafka Docker container down to your node and start an interactive pseudo-TTY session.    
        
        ```bash
        docker run -it mesosphere/kafka-client
        ```
        
        The output should resemble:
        
        ```bash
        Unable to find image 'mesosphere/kafka-client:latest' locally
        latest: Pulling from mesosphere/kafka-client
        efd26ecc9548: Pull complete 
        a3ed95caeb02: Pull complete 
        d1784d73276e: Pull complete 
        52a884c93bb2: Pull complete 
        070ee56a6f7e: Pull complete 
        f8b8b1302b4f: Pull complete 
        e71221cc9598: Pull complete 
        349c9e35d503: Pull complete 
        0686c3f0e36a: Pull complete 
        Digest: sha256:92eacfe5cf19bb194d3b08e92a3bde985777da765a3aa5398f275cfc8d7e27c7
        Status: Downloaded newer image for mesosphere/kafka-client:latest
        ```
        
    1.  Send some messages. Kafka comes with a command line client that will take input from a file or from standard input and send it out as messages to the Kafka cluster. By default, each line will be sent as a separate message.    
        
        ```bash
        echo "Hello, World." | ./kafka-console-producer.sh --broker-list broker.kafka.l4lb.thisdcos.directory:9092 --topic topic
        ```
        
    1.  Start a consumer. Kafka has a command line consumer that will write messages to standard output.
       
        ```bash
        ./kafka-console-consumer.sh --zookeeper master.mesos:2181/dcos-service-kafka --topic topic1 --from-beginning
        ```
        
        The output should resemble:
        
        ```bash
        Hello, World.
        ```

See also [Connecting clients][1].

 [1]: /services/kafka/v1.1.19.1-0.10.1.0/connecting-clients/
