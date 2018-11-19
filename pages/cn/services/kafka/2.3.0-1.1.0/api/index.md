---
layout: layout.pug
navigationTitle: API 参考
excerpt: DC/OS Apache Kafka 的 API 参考
title: API 参考
menuWeight: 90
model: /cn/services/kafka/data.yml
render: mustache
---

#include /cn/services/include/api-reference.tmpl

# 主题操作

这些操作会镜像 `bin/kafka-topics.sh` 所提供的内容。

## 列表主题

```bash
$ dcos {{ model.packageName }} --name={{ model.serviceName }} topic list
[
  "topic1",
  "topic0"
]
```

```bash
$ curl -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics"
[
  "topic1",
  "topic0"
]
```

## 描述主题

```bash
$ dcos {{ model.packageName }} --name={{ model.serviceName }} topic describe topic1
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
$ curl -X POST -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/topic1"
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

## 创建主题

```bash
$ dcos {{ model.packageName }} --name={{ model.serviceName }} topic create topic1 --partitions=3 --replication=3
{
  "message": "Output: Created topic \"topic1\"\n"
}
```

```bash
$ curl -X POST -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/topic1?partitions=3&replication=3"
{
  "message": "Output: Created topic \"topic1\"\n"
}
```

## 查看主题偏移

可选的 `--time` 参数可以被设置为“first”、“last” 或时间戳（以毫秒为单位），[如 {{ model.techShortName }} 文档中所述](https://kafka.apache.org/documentation/#topicconfigs)。

```bash
$ dcos {{ model.packageName }} --name={{ model.serviceName }} topic offsets topic1 --time=last
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
$ curl -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/topic1/offsets?time=-1"
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

## 修改主题分区计数

```
$ dcos {{ model.packageName }} --name={{ model.serviceName }} topic partitions topic1 2
{
  "message": "Output: WARNING: If partitions are increased for a topic that has a key, the partition logic or ordering of the messages will be affectednAdding partitions succeeded!n"
}
```

```bash
$ curl -X PUT -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/topic1?operation=partitions&partitions=2"
{
  "message": "Output: WARNING: If partitions are increased for a topic that has a key, the partition logic or ordering of the messages will be affectednAdding partitions succeeded!n"
}
```

## 在主题上运行生产者测试

```
$ dcos {{ model.packageName }} --name={{ model.serviceName }} topic producer_test topic1 10
{
  "message": "10 records sent, 70.422535 records/sec (0.07 MB/sec), 24.20 ms avg latency, 133.00 ms max latency, 13 ms 50th, 133 ms 95th, 133 ms 99th, 133 ms 99.9th.n"
}
```
```bash
$ curl -X PUT -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/topic1?operation=producer-test&messages=10"
{
  "message": "10 records sent, 70.422535 records/sec (0.07 MB/sec), 24.20 ms avg latency, 133.00 ms max latency, 13 ms 50th, 133 ms 95th, 133 ms 99th, 133 ms 99.9th.n"
}
```

这相当于运行计算机运行 {{ model.techShortName }} 调度器时所用的以下命令：
```bash
$ kafka-producer-perf-test.sh \
  --topic <topic> \
  --num-records <messages> \
  --throughput 100000 \
  --record-size 1024 \
  --producer-props bootstrap.servers=<current broker endpoints>
```

## 删除主题

```bash
$ dcos {{ model.packageName }} --name={{ model.serviceName }} topic delete topic1
{
  "message": "Topic topic1 is marked for deletion.nNote: This will have no impact if delete.topic.enable is not set to true.n"
}
```

```bash
$ curl -X DELETE -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/topic1"
{
  "message": "Topic topic1 is marked for deletion.nNote: This will have no impact if delete.topic.enable is not set to true.n"
}
```

请注意以上命令输出中的警告。您可以更改指示 `delete.topic.enable` 配置值，作为配置更改。

## 列出 Under Replicated 分区

```bash
$ dcos {{ model.packageName }} --name={{ model.serviceName }} topic under_replicated_partitions
{
  "message": ""
}
```

```bash
$ curl -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/under_replicated_partitions"
{
  "message": ""
}
```

## 列出不可用分区

```bash
$ dcos {{ model.packageName }} --name={{ model.serviceName }} topic unavailable_partitions
{
  "message": ""
}
```

```bash
$ curl -H "Authorization: token=$auth_token" "<dcos_url>/service/{{ model.serviceName }}/v1/topics/unavailable_partitions"
{
  "message": ""
}
```
