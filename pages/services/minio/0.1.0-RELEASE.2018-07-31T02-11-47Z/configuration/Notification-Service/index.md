---
layout: layout.pug
navigationTitle: Notification Service 
title: Notification Service
menuWeight: 25
excerpt: DC/OS Minio Notification Service
featureMaturity:
enterprise: false
---

# Overview

Enable Notification Services to monitor events occurring on objects in a bucket. Minio supports following targets to publish bucket events:

 1. AMQP
 2. Redis
 3. MySQL
 4. MQTT
 5. NATS
 6. Apache Kafka
 7. Elasticsearch
 8. PostgreSQL
 9. Webhooks

Use client tools like `mc` to set and listen for event notifications using the event [sub-command](https://docs.minio.io/docs/minio-client-complete-guide#events).

# Notification Services

## AMQP

Install RabbitMQ from [here](https://www.rabbitmq.com/).

AMQP notification service can be enabled by providing following configurations through UI.

[<img src="../../img/AMQP.png" alt="AMQP" width="800"/>](../img/AMQP.png)

Buckets can be configured to generate events through client tools like `mc`. For example,

`mc events add myminio/images arn:minio:sqs::1:amqp --suffix .jpg`

Above command will add event to bucket named `images` through minio client named `myminio` on the addition or deletion of objects with suffix .jpg.

## Elasticsearch

Install [Elasticsearch](https://www.elastic.co/downloads/elasticsearch) server.

This notification target supports two formats: namespace and access.

Elasticsearch notification service can be enabled by providing following configurations through UI.

[<img src="../../img/Elasticsearch.png" alt="Elasticsearch" width="800"/>](../img/Elasticsearch.png)

Buckets can be configured to generate events through client tools like `mc`. For example,

`mc events add  myminio/images arn:minio:sqs::1:elasticsearch --suffix .jpg`

Above command will add event to bucket named `images` through minio client named `myminio` on the addition or deletion of objects with suffix .jpg.

## Redis

Install [Redis](https://redis.io/download) server. 

This notification target supports two formats: namespace and access.

Redis notification service can be enabled by providing following configurations through UI.

[<img src="../../img/Redis.png" alt="Redis" width="800"/>](../img/Redis.png)

Buckets can be configured to generate events through client tools like `mc`. For example,

`mc events add  myminio/images arn:minio:sqs::1:redis --suffix .jpg`

Above command will add event to bucket named `images` through minio client named `myminio` on the addition or deletion of objects with suffix .jpg.

## PostgreSQL

Install [PostgreSQL](https://www.postgresql.org/) database server.

This notification target supports two formats: namespace and access.

PostgreSQL notification service can be enabled by providing following configurations through UI.

[<img src="../../img/PostgreSQL.png" alt="PostgreSQL" width="800"/>](../img/PostgreSQL.png)

Buckets can be configured to generate events through client tools like `mc`. For example,

`mc events add myminio/images arn:minio:sqs::1:postgresql --suffix .jpg`

Above command will add event to bucket named `images` through minio client named `myminio` on the addition or deletion of objects with suffix .jpg.

## Kafka

Install Apache Kafka from [here](http://kafka.apache.org/).

Kafka notification service can be enabled by providing following configurations through UI.

[<img src="../../img/Kafka.png" alt="Kafka" width="800"/>](../img/Kafka.png)

Buckets can be configured to generate events through client tools like `mc`. For example,

`mc events add  myminio/images arn:minio:sqs::1:kafka --suffix .jpg`

Above command will add event to bucket named `images` through minio client named `myminio` on the addition or deletion of objects with suffix .jpg.

## Webhook

[Webhooks](https://en.wikipedia.org/wiki/Webhook) are a way to receive information when it happens, rather than continually polling for that data.

Webhook notification service can be enabled by providing following configurations through UI.

[<img src="../../img/Webhook.png" alt="Webhook" width="800"/>](../img/Webhook.png)

Buckets can be configured to generate events through client tools like `mc`. For example,

`mc events add myminio/images arn:minio:sqs::1:webhook --events put --suffix .jpg`

Above command will add event to bucket named `images` through minio client named `myminio` on the addition or deletion of objects with suffix .jpg.

## Mysql

Install MySQL from [here](https://dev.mysql.com/downloads/mysql/).

This notification target supports two formats: namespace and access.

Mysql notification service can be enabled by providing following configurations through UI.

[<img src="../../img/Mysql.png" alt="Mysql" width="800"/>](../img/Mysql.png)

Buckets can be configured to generate events through client tools like `mc`. For example,

`mc events add myminio/images arn:minio:sqs::1:postgresql --suffix .jpg`

Above command will add event to bucket named `images` through minio client named `myminio` on the addition or deletion of objects with suffix .jpg.

## MQTT

Install an MQTT Broker from [here](https://mosquitto.org/).

MQTT notification service can be enabled by providing following configurations through UI.

[<img src="../../img/MQTT.png" alt="MQTT" width="800"/>](../img/MQTT.png)

Buckets can be configured to generate events through client tools like `mc`. For example,

`mc events add  myminio/images arn:minio:sqs::1:mqtt --suffix .jpg`

Above command will add event to bucket named `images` through minio client named `myminio` on the addition or deletion of objects with suffix .jpg.

## NATS

Install NATS from [here](https://nats.io/).

NATS notification service can be enabled by providing following configurations through UI.

[<img src="../../img/NATS.png" alt="NATS" width="800"/>](../img/NATS.png)

[<img src="../../img/NATS1.png" alt="NATS1" width="800"/>](../img/NATS1.png)

Buckets can be configured to generate events through client tools like `mc`. For example,

`mc events add  myminio/images arn:minio:sqs::1:nats --suffix .jpg`

Above command will add event to bucket named `images` through minio client named `myminio` on the addition or deletion of objects with suffix .jpg.

Added events can be listed through following command:

`mc events list myminio/images`

For more information visit [Minio Bucket Notification Guide](https://docs.minio.io/docs/minio-bucket-notification-guide.html).
