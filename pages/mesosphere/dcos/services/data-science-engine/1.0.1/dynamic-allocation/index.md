---
layout: layout.pug
navigationTitle: Dynamic Allocation 
excerpt: Enabling Dynamic Allocation with Shuffle Service for DC/OS Data Science Engine Spark
title: Dynamic Allocation
menuWeight: 7
enterprise: true
model: /mesosphere/dcos/services/data-science-engine/data.yml
render: mustache
---

# Prerequisites

- {{ model.techName }} must use a host networking mode, due to the specifics of Spark executors communication with Shuffle Service and the way shuffle blocks are served. 

  Once Executor has written a shuffle block to disk, it registers the block with the driver and the block location includes the host IP address. The block is then fetched by other executors using this IP. Using a virtual network does not fit in this architecture because each executor will have a unique IP address not representing the physical host where the blocks are located.
- Shuffle Service must be installed on every host where Spark Executors will be running. 
  
  Both Shuffle Service and Spark Executors should use the same shared host folder/volume for saving and serving shuffle blocks.
- The Spark user (Linux user running the Shuffle Service and Executors) should have read-write privileges for the shared folder.

# Shuffle Service

Run a Marathon application with the configuration shown below. The number of instances should be equal to the number of nodes in the cluster. Suppose the number of nodes are 5 in the cluster:

```json
{
  "id": "/mesos-shuffle-service",
  "cmd": "rm -rf /tmp/spark/spark-* && rm -rf /tmp/spark/blockmgr-* && /opt/spark/sbin/start-mesos-shuffle-service.sh --conf spark.shuffle.service.enabled=true --conf spark.network.timeout=10s --conf spark.shuffle.io.connectionTimeout=10s && cd /opt/spark/logs/ && find . -name 'spark--org.apache.spark.deploy.mesos.MesosExternalShuffleService-*.out' -exec tail -f {} \\;",
  "cpus": 0.05,
  "mem": 1024,
  "disk": 0,
  "instances": 5,
  "constraints": [
    [
      "hostname",
      "UNIQUE"
    ]
  ],
  "container": {
    "type": "MESOS",
    "docker": {
      "forcePullImage": false,
      "image": "mesosphere/jupyter-service-worker:b077952483120bff524200cbb77cb018d79f899d-cpu",
      "parameters": [],
      "privileged": false
    },
    "volumes": [
      {
        "containerPath": "/tmp/spark",
        "hostPath": "/tmp/spark",
        "mode": "RW"
      }
    ]
  },
  "env": {
    "SPARK_DAEMON_MEMORY": "1g"
  },
  "healthChecks": [
    {
      "gracePeriodSeconds": 5,
      "intervalSeconds": 60,
      "maxConsecutiveFailures": 3,
      "port": 7337,
      "protocol": "TCP",
      "ipProtocol": "IPv4",
      "timeoutSeconds": 10,
      "delaySeconds": 15
    }
  ],
  "portDefinitions": [
    {
      "port": 7337,
      "name": "ssp",
      "protocol": "tcp"
    }
  ],
  "maxLaunchDelaySeconds": 300,
  "requirePorts": true
}
```

# Spark Configurations

The key properties for enabling dynamic allocation are:
- `spark.shuffle.service.enabled=true` and `spark.dynamicAllocation.enabled=true` for enabling the allocation
- `spark.local.dir=/tmp/spark` folder inside a container used for shuffle blocks
- `spark.mesos.executor.docker.volumes=<host path>:/tmp/spark:rw` property for mounting container local folder to the host path to share shuffle blocks with Shuffle Service

Example application:

```scala
import org.apache.spark.{SparkConf, SparkContext}
import scala.util.Random

val spark = SparkSession.builder()
.config("spark.shuffle.service.enabled", "true")
.config("spark.dynamicAllocation.enabled", "true")
.config("spark.dynamicAllocation.minExecutors", 1)
.config("spark.dynamicAllocation.maxExecutors", 10)
.config("spark.local.dir", "/tmp/spark")
.config("spark.mesos.executor.docker.volumes", "/tmp/spark:/tmp/spark:rw")
.getOrCreate()

val numMappers = 100
val numKeys = 1000000
val valSize = 10
val numReducers = 100

val keyPairs = spark.sparkContext.parallelize(0 until numMappers, numMappers).flatMap { _ =>
  val random = new Random
  val result = new Array[(Int, Array[Byte])](numKeys)

  //each partition will contain a full copy of keys to enforce shuffle
  for (i <- 0 until numKeys) {
    val byteArr = new Array[Byte](valSize)
    random.nextBytes(byteArr)
    result(i) = (i, byteArr)
  }
  result
}

val groupsCount = keyPairs.groupByKey(numReducers).count()
println(s"Groups count: $groupsCount")
```

Expected output would be:

```text
Groups count: 1000000
 
numMappers = 100
numKeys = 1000000
valSize = 10
numReducers = 100
keyPairs = MapPartitionsRDD[1] at flatMap at <console>:50
groupsCount = 1000000
```

# Executor and Shuffle Service Logs

Here are some excerpts from the logs to verify that Shuffle takes place and no issues occur. Executor logs should not contain any network connectivity or file system related exceptions. When shuffle occurs, it can be seen in the logs where `ShuffleBlockFetcherIterator` retrieves the blocks from the remote locations:

```log
20/01/10 22:51:58 INFO executor.CoarseGrainedExecutorBackend: Got assigned task 189
20/01/10 22:51:58 INFO executor.Executor: Running task 85.0 in stage 1.0 (TID 189)
20/01/10 22:51:58 INFO storage.ShuffleBlockFetcherIterator: Getting 100 non-empty blocks including 15 local blocks and 85 remote blocks
20/01/10 22:51:58 INFO storage.ShuffleBlockFetcherIterator: Started 7 remote fetches in 2 ms
20/01/10 22:51:59 INFO executor.Executor: Finished task 85.0 in stage 1.0 (TID 189). 1219 bytes result sent to driver
```

On the Shuffle Service side, a healthy log in stdout should look as following and include messages about application and executor registration and following removal and cleanup when the application is finished:

```log
20/01/10 22:46:46 INFO mesos.MesosExternalShuffleBlockHandler: Received registration request from app 1d618e80-45be-4d0f-9892-955cc384041d-0023 (remote address /10.0.2.204:46778, heartbeat timeout 120000 ms).
20/01/10 22:46:50 INFO shuffle.ExternalShuffleBlockResolver: Registered executor AppExecId{appId=1d618e80-45be-4d0f-9892-955cc384041d-0023, execId=f86a1961-aa0e-4a73-af13-dd7c03901b68-0} with ExecutorShuffleInfo{localDirs=[/tmp/spark/blockmgr-99aa7dea-5770-4344-8062-81bca143a06e], subDirsPerLocalDir=64, shuffleManager=org.apache.spark.shuffle.sort.SortShuffleManager}
20/01/10 22:47:47 INFO shuffle.ExternalShuffleBlockResolver: Registered executor AppExecId{appId=1d618e80-45be-4d0f-9892-955cc384041d-0023, execId=f86a1961-aa0e-4a73-af13-dd7c03901b68-4} with ExecutorShuffleInfo{localDirs=[/tmp/spark/blockmgr-dedfbc72-4464-4eb6-9fc0-fe6532c5cdaf], subDirsPerLocalDir=64, shuffleManager=org.apache.spark.shuffle.sort.SortShuffleManager}
20/01/10 22:48:45 INFO mesos.MesosExternalShuffleBlockHandler: Application 1d618e80-45be-4d0f-9892-955cc384041d-0022 timed out. Removing shuffle files.
20/01/10 22:48:45 INFO shuffle.ExternalShuffleBlockResolver: Application 1d618e80-45be-4d0f-9892-955cc384041d-0022 removed, cleanupLocalDirs = true
```
