---
layout: layout.pug
navigationTitle: Fault Tolerance
excerpt: Understanding DC/OS Apache Spark fault tolerance
title: Fault Tolerance
menuWeight: 100
featureMaturity:
model: /services/spark/data.yml
render: mustache
---

Failures such as host, network, JVM, or application failures can affect the behavior of three types of {{ model.techShortName }} components:

- DC/OS {{ model.techName }} service
- Batch jobs
- Streaming jobs

# DC/OS {{ model.techName }} service

The DC/OS {{ model.techName }} service runs in Marathon and includes the Mesos Cluster Dispatcher and the {{ model.techShortName }} history server.  The Dispatcher manages jobs you submit using `dcos spark run`.  Job data is persisted to Zookeeper. The {{ model.techShortName }} history server reads event logs from HDFS. If the service dies, Marathon restarts it, and reloads data from these highly available stores.

# Batch jobs

Batch jobs are resilient to executor failures, but not driver failures. The Dispatcher will restart a driver if you submit it with the `--supervise` option.

## Driver

When the driver fails, executors are terminated, and the entire {{ model.techShortName }} application fails.  If you submitted your job with the `--supervise` option, then the Dispatcher restarts the job.

## Executors

Batch jobs are resilient to executor failure.  Upon failure, cached data, shuffle files, and partially computed RDDs are lost.  However, {{ model.techShortName }} RDDs are fault-tolerant, and {{ model.techShortName }} will start a new executor to recompute lost data from the original data source, caches, or shuffle files.  There is a performance cost as data is recomputed, but an executor failure will not cause a job to fail.

# Streaming jobs

Whereas batch jobs run once and can usually be restarted upon failure, streaming jobs often need to run constantly.  The application must survive driver failures, often with no data loss.

To experience no data loss, you must run streaming jobs with write-ahead logging (WAL) enabled. The one exception is that, if you're consuming from Kafka, you can use the Direct Kafka API.

For **exactly-once** processing semantics, you must use the Direct Kafka API.  All other receivers provide **at least once** semantics.

## Failures

There are two types of failures:

- Driver
- Executor

## Job features

There are a few variables that affect the reliability of your job:

- [WAL][1]
- [Receiver reliability][2]
- [Storage level][3]

## Reliability features

The two reliability features of a job are data loss and processing semantics.  Data loss occurs when the source sends data, but the job fails to process it.  Processing semantics describe how many times a received message is processed by the job.  It can be either "at least once" or "exactly once"

### Data loss

A {{ model.techShortName }} job loses data when delivered data does not get processed. The following is a list of configurations with increasing data preservation guarantees:

- Unreliable receivers

Unreliable receivers do not acknowledge the data they receive from the source. This means that buffered data in the receiver is lost if the executor fails.

executor failure => **data loss** driver failure => **data loss**

- Reliable receivers, unreplicated storage level

This is an unusual configuration.  By default, {{ model.techShortName }} streaming receivers run with a replicated storage level.  But if you reduce the storage level to be unreplicated, data stored on the receiver but not yet processed will not survive executor failure.

  executor failure => **data loss**  
  driver failure => **data loss**

- Reliable receivers, replicated storage level

This is the default configuration.  Data stored in the receiver is replicated, and can thus survive a single executor failure.  Driver failures, however, result in all executors failing, and therefore result in data loss.

  (single) executor failure => **no data loss**  
  driver failure => **data loss**

- Reliable receivers, write-ahead logging

With write-ahead logging enabled, data stored in the receiver is written to a highly available store such as S3 or HDFS.  This means that an app can recover from even a driver failure.

  executor failure => **no data loss**  
  driver failure => **no data loss**

- Direct Kafka consumer, no checkpointing

Since {{ model.techShortName }} 1.3, the {{ model.techShortName }} + Kafka integration has supported an experimental direct consumer, which does not use traditional receivers.  With the direct consumer approach, RDDs read directly from kafka, rather than buffering data in receivers.

However, when a driver restarts without checkpointing, the driver starts reading from the latest Kafka offset, rather than where the previous driver left off.

  executor failure => **no data loss**  
  driver failure => **data loss**

- Direct Kafka consumer, checkpointing

With checkpointing enabled, Kafka offsets are stored in a reliable store such as HDFS or S3.  This means that an application can restart exactly where it left off.

  executor failure => **no data loss**  
  driver failure => **no data loss**

### Processing semantics

Processing semantics apply to how many times received messages get processed.  With {{ model.techShortName }} streaming jobs, this can be either "at least once" or "exactly-once".

The semantics below describe how "at least once" or "exactly-once" processing apply to {{ model.techShortName }} receipt of the data.  To provide an end-to-end exactly-once guarantee, you must additionally verify that your output operation provides exactly-once guarantees. More info [here][4].

- Receivers

  **at least once**

Every {{ model.techShortName }} streaming consumer, with the exception of the direct Kafka consumer described below, uses receivers.  Receivers buffer blocks of data in memory, then write them according to the storage level of the job.  After writing out the data, receivers send an acknowledgement to the source so the source knows not to re-send the data. 

However, if this acknowledgement fails, or the node fails between writing out the data and sending the acknowledgement, then an inconsistency arises.  {{ model.techShortName }} believes that the data has been received, but the source does not.  This results in the source re-sending the data, and it being processed twice.

- Direct Kafka consumer

  **exactly-once**

The direct Kafka consumer avoids the problem described above by reading directly from Kafka, and storing the offsets itself in the checkpoint directory.

  More information [here][5].

[1]: https://spark.apache.org/docs/1.6.0/streaming-programming-guide.html#requirements
[2]: https://spark.apache.org/docs/1.6.0/streaming-programming-guide.html#with-receiver-based-sources
[3]: http://spark.apache.org/docs/latest/programming-guide.html#which-storage-level-to-choose
[4]: http://spark.apache.org/docs/latest/streaming-programming-guide.html#semantics-of-output-operations
[5]: https://databricks.com/blog/2015/03/30/improvements-to-kafka-integration-of-spark-streaming.html
