---
layout: layout.pug
navigationTitle: 远程存储
title: Impx DB 上的 Prometheus 远程存储
menuWeight: 40
excerpt: 将 Prometheus 与远程存储 ImpxDB 集成
featureMaturity:
enterprise: false
---

# 远程存储

DC/OS Prometheus 本地存储不预期作为长期数据存储之用，它是临时缓存。Prometheus 的远程写入和远程读取功能允许透明地发送和接收样例。

## Impx DB 上的 Prometheus 远程存储

Prometheus 支持远程读取和写入 API，将抓取的数据存储到其他数据存储上。写入将被转发到远程存储中。


### 先决条件

 1. 安装 InfluxDB
 2. 启动 ImpxDB 服务
 3. 创建用户和密码
 3. 创建数据库（您希望存储 Prometheus 度量标准的位置）。

### 与 InfluxDB 的集成

 ImpxDB 服务启动和运行后，需要在 Prometheus 一侧进行以下配置：

**模板：**

```
# Remote write configuration (for Graphite, OpenTSDB, or InfluxDB).
remote_write:
 - url: "http://<Public ip of influx server>:<influx service port>/api/v1/prom/write?u=<user>&p=<password>&db=<dbname>"

# Remote read configuration (for InfluxDB only at the moment).
remote_read:
 - url: "http://<Public ip of influx server>:<influx service port>/api/v1/prom/read?u=<user>&p=<password>&db=<dbname>"Sample :# Remote write configuration (for Graphite, OpenTSDB, or InfluxDB).
```

**示例：**

```
# Remote write configuration (for Graphite, OpenTSDB, or InfluxDB).
remote_write:
 - url: "http://52.79.251.5:8086/api/v1/prom/write?u=<user>&p=<password>&db=prometheus_demo"

# Remote read configuration (for InfluxDB only at the moment).
remote_read:
 - url: "http://52.79.251.5:8086/api/v1/prom/read?u=<user>&p=<password>&db=prometheus_demo"
```

ImpxDB 默认侦听端口号为 8086。
