---
layout: layout.pug
navigationTitle:
excerpt: API reference for DC/OS Apache Kafka
title: API Reference
menuWeight: 90
model: /mesosphere/dcos/services/kafka/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/api-reference.tmpl

# Topic Operations

These operations mirror what is available with `bin/kafka-topics.sh`.

## List Topics

```bash
dcos {{ model.packageName }} --name={{ model.serviceName }} topic list
[
  "topic1",
  "topic0"
]
```

```bash
curl -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics"
[
  "topic1",
  "topic0"
]
```

## Describe Topic

```bash
dcos {{ model.packageName }} --name={{ model.serviceName }} topic describe topic1
{
  "partitions": [
  {
    "0": {
      "controller_epoch": 1,
      "isr": [
        0,
        1,
        2
      ],
      "leader": 0,
      "leader_epoch": 0,
      "version": 1
    }
  },
  {
    "1": {
      "controller_epoch": 1,
      "isr": [
        1,
        2,
        0
      ],
      "leader": 1,
      "leader_epoch": 0,
      "version": 1
    }
  },
  {
    "2": {
      "controller_epoch": 1,
      "isr": [
        2,
        0,
        1
      ],
      "leader": 2,
      "leader_epoch": 0,
      "version": 1
    }
  }
  ]
}
```

```bash
curl -X POST -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/topic1"
{
  "partitions": [
  {
    "0": {
      "controller_epoch": 1,
      "isr": [
        0,
        1,
        2
      ],
      "leader": 0,
      "leader_epoch": 0,
      "version": 1
    }
  },
  {
    "1": {
      "controller_epoch": 1,
      "isr": [
        1,
        2,
        0
      ],
      "leader": 1,
      "leader_epoch": 0,
      "version": 1
    }
  },
  {
    "2": {
      "controller_epoch": 1,
      "isr": [
        2,
        0,
        1
      ],
      "leader": 2,
      "leader_epoch": 0,
      "version": 1
    }
  }
  ]
}

```

## Create Topic

```bash
dcos {{ model.packageName }} --name={{ model.serviceName }} topic create topic1 --partitions=3 --replication=3
{
  "message": "Output: Created topic \"topic1\"\n"
}
```

```bash
curl -X POST -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/topic1?partitions=3&replication=3"
{
  "message": "Output: Created topic \"topic1\"\n"
}
```

## View Topic Offsets

There is an optional `--time` parameter which may be set to either "first", "last", or a timestamp in milliseconds as described in the [{{ model.techShortName }} documentation](https://kafka.apache.org/documentation/#topicconfigs).

```bash
dcos {{ model.packageName }} --name={{ model.serviceName }} topic offsets topic1 --time=last
[
  {
    "2": "334"
  },
  {
    "1": "333"
  },
  {
    "0": "333"
  }
]
```

```bash
curl -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/topic1/offsets?time=-1"
[
  {
    "2": "334"
  },
  {
    "1": "333"
  },
  {
    "0": "333"
  }
]
```

## Alter Topic Partition Count

```
dcos {{ model.packageName }} --name={{ model.serviceName }} topic partitions topic1 2
{
  "message": "Output: WARNING: If partitions are increased for a topic that has a key, the partition logic or ordering of the messages will be affectednAdding partitions succeeded!n"
}
```

```bash
curl -X PUT -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/topic1?operation=partitions&partitions=2"
{
  "message": "Output: WARNING: If partitions are increased for a topic that has a key, the partition logic or ordering of the messages will be affectednAdding partitions succeeded!n"
}
```

## Run Producer Test on Topic

```
dcos {{ model.packageName }} --name={{ model.serviceName }} topic producer_test topic1 10
{
  "message": "10 records sent, 70.422535 records/sec (0.07 MB/sec), 24.20 ms avg latency, 133.00 ms max latency, 13 ms 50th, 133 ms 95th, 133 ms 99th, 133 ms 99.9th.n"
}
```
```bash
curl -X PUT -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/topic1?operation=producer-test&messages=10"
{
  "message": "10 records sent, 70.422535 records/sec (0.07 MB/sec), 24.20 ms avg latency, 133.00 ms max latency, 13 ms 50th, 133 ms 95th, 133 ms 99th, 133 ms 99.9th.n"
}
```

The above commands run the equivalent of the following command from the machine running the {{ model.techShortName }} Scheduler:

```bash
kafka-producer-perf-test.sh \
  --topic <topic> \
  --num-records <messages> \
  --throughput 100000 \
  --record-size 1024 \
  --producer-props bootstrap.servers=<current broker endpoints>
```

## Delete Topic

```bash
dcos {{ model.packageName }} --name={{ model.serviceName }} topic delete topic1
{
  "message": "Topic topic1 is marked for deletion.nNote: This will have no impact if delete.topic.enable is not set to true.n"
}
```

```bash
curl -X DELETE -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/topic1"
{
  "message": "Topic topic1 is marked for deletion.nNote: This will have no impact if delete.topic.enable is not set to true.n"
}
```

<p class="message--note"><strong>NOTE: </strong>Note the warning in the output from the commands above. You can change the indicated `delete.topic.enable` configuration value as a configuration change.</p>

## List Under Replicated Partitions

```bash
dcos {{ model.packageName }} --name={{ model.serviceName }} topic under_replicated_partitions
{
  "message": ""
}
```

```bash
curl -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/under_replicated_partitions"
{
  "message": ""
}
```

## List Unavailable Partitions

```bash
dcos {{ model.packageName }} --name={{ model.serviceName }} topic unavailable_partitions
{
  "message": ""
}
```

```bash
curl -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/unavailable_partitions"
{
  "message": ""
}
```
