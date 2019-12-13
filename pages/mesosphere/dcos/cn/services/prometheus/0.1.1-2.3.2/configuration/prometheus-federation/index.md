---
layout: layout.pug
navigationTitle: DC/OS Prometheus 联合
title: DC/OS Prometheus 联合
menuWeight: 35
excerpt: 为 Prometheus 配置 Federation
featureMaturity:
enterprise: false
---

## DC/OS Prometheus 联合
联合允许您将层次结构中的聚合上提到全局 Prometheus 服务器。默认 Prometheus 配置 yml 中需要外部标签、度量标准路径和匹配字段，以设置联合配置。

- **外部标签：** 与外部系统通信时附上这些标签。
- **度量标准路径：** 默认度量标准路径为 /metrics。对于联合，应将其更改为 /federate。
- **匹配：** 此处的匹配[] 需要所有作业级别时间序列。
- **全局 prometheus：** 将自从属 Prometheus 服务器收到数据的 Prometheus 服务器。

全局 prometheus 服务器配置模板：

```
# my global config
global:
 scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
 external_labels:
   job: '~".+"'
# A scrape configuration containing exactly one endpoint to scrape:
# Here it is Prometheus itself.
# Alert Rules
 rule_files:
 - alert.rules.yml
 scrape_configs:
 # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.    
 # Self Monitoring
 - job_name: prometheus
 static_configs:
   - targets: ['localhost:9090']  - job_name: agent-metrics
# All agent nodes are written regularly to discovery/agents.json
  file_sd_configs:
  - files: ['discovery/agents.json']  - job_name: 'globalprometheus'
# scheme defaults to 'http'.
  metrics_path: /federate
  params:
   match[]:
     - '{job=~".+"}'
   static_configs:
    - targets: ['Slave Prometheus endpoint1','Slave Prometheus endpoint2']
```

### 使用案例：简单的集群服务实施（全局 Prometheus 服务）

要联合来自两个或多个 Prometheus 服务器的数据，我们必须将 Prometheus 服务启动为全局 Prometheus 服务，并将全局 Prometheus 服务器端点作为目标传递给 `slave prometheus` 服务。要启动全局 Prometheus 服务器，查看上一节中给出的模板。

<p class="message--note"><strong>注意：</strong> 全局 Prometheus 服务仅对来自其他 Prometheus 服务器的联合数据有用，不会监控任何数据，这点不同于其他 <tt>-prometheus</tt> 服务器。</p>

Prometheus Service1、Prometheus Service2：两个 prometheus 服务器集群监控不同目标并将数据联合到全局  Prometheus 服务器。

如果是独立 Prometheus 服务器，默认抓取路径是 `/metrics`，如果是全局 Prometheus 服务器，则默认抓取路径为 `/federate`；全局 Prometheus 服务器的目标是其他 Prometheus 服务。
