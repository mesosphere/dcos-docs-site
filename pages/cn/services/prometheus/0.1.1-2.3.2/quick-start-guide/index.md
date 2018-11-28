---
layout: layout.pug
navigationTitle: 快速启动
excerpt: 如何通过 DC/OS 使用 Prometheus
title: 快速启动
menuWeight: 15
---

本部分将介绍如何配置 Prometheus 以配合使用 DC/OS。

## 先决条件

- 运行的 DC/OS 1.11 集群

## 安装

Prometheus 可通过 DC/OS 目录 Web 界面或使用 CLI 进行安装。以下命令将通过 DC/OS CLI 启动安装：

```bash
dcos package install prometheus
```

[<img src="/services/prometheus/0.1.1-2.3.2/img/prom_install.png" alt="Prometheus 安装"/>](/services/prometheus/0.1.1-2.3.2/img/prom_install.png)

图 1. 安装 Prometheus


同样从服务目录中安装 Grafana。它可用作绘图工具。
```bash
dcos package install --yes grafana
```

框架提供输入 Prometheus、AlertManager 和规则配置的选项。默认 Prometheus 配置将在集群中抓取 DC/OS 管理节点和代理。将任何新配置附加到结尾。

## 访问 Prometheus UI

框架启动和运行后：
1. 安装 [Edge-LB(/services/edge-lb/)]。
2. 创建名为 `prometheus-edgelb.json` 并包含以下 `edge-lb` 配置的文件：

```
{
  "apiVersion": "V2",
  "name": "prometheus",
  "count": 1,
  "haproxy": {
    "frontends": [
      {
        "bindPort": 9092,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "prometheus"
        }
      },
      {
        "bindPort": 9093,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "alertmanager"
        }
      },
      {
        "bindPort": 9094,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "grafana"
        }
      },
      {
        "bindPort": 9091,
        "protocol": "HTTP",
        "linkBackend": {
          "defaultBackend": "pushgateway"
        }
      }
    ],
    "backends": [
     {
      "name": "prometheus",
      "protocol": "HTTP",
      "services": [{
        "endpoint": {
          "type": "ADDRESS",
          "address": "prometheus.prometheus.l4lb.thisdcos.directory",
          "port": 9090
        }
      }]
    },
    {
     "name": "alertmanager",
     "protocol": "HTTP",
     "services": [{
       "endpoint": {
         "type": "ADDRESS",
         "address": "alertmanager.prometheus.l4lb.thisdcos.directory",
         "port": 9093
       }
     }]
   },
   {
    "name": "grafana",
    "protocol": "HTTP",
    "services": [{
      "endpoint": {
        "type": "ADDRESS",
        "address": "grafana.grafana.l4lb.thisdcos.directory",
        "port": 3000
      }
    }]
   },
   {
    "name": "pushgateway",
    "protocol": "HTTP",
    "services": [{
      "endpoint": {
        "type": "ADDRESS",
        "address": "pushgateway.prometheus.l4lb.thisdcos.directory",
        "port": 9091
      }
    }]
   }
   ]
  }
}
```


3. 在浏览器中输入以下地址：


```
http://<public-agent-ip>:9092
```

[<img src="/services/prometheus/0.1.1-2.3.2/img/prom_dashboard.png" alt="Prometheus 仪表板"/>](/services/prometheus/0.1.1-2.3.2/img/prom_dashboard.png)

图 2. Prometheus 仪表板


您还可以通过导航到其度量标准端点来验证 Prometheus 是否正在提供有关自身的度量标准：

```
http://<public-agent-ip>:9092/metrics
```

### 使用表达式浏览器

返回控制台视图，并将此内容输入到表达式控制台：

`prometheus_target_interval_length_seconds`

这应该返回多个不同的时间序列（以及为每个序列记录的最新值），其度量标准名称都为 `prometheus_target_interval_length_seconds`。

另一个示例，输入以下表达式，以图形表示在自我抓取的 Prometheus 中创建的组块的每秒速率：

`rate(prometheus_tsdb_head_chunks_created_total[1m])`

[<img src="/services/prometheus/0.1.1-2.3.2/img/prom_graphing.png" alt="Prometheus 绘图"/>](/services/prometheus/0.1.1-2.3.2/img/prom_graphing.png)

图 3. Prometheus 绘图

## Grafana 与 Prometheus 配合使用

使用凭证 `admin/admin` 导航至以下 URL。

```
http://<public-agent-ip>:9094
```

这将带您前往 Grafana 控制台。

[<img src="/services/prometheus/0.1.1-2.3.2/img/grafana_login.png" alt="Grafana 登录"/>](/services/prometheus/0.1.1-2.3.2/img/grafana_login.png)

图 4. Grafana 控制台。


您可以将 Prometheus 添加为数据源：

[<img src="/services/prometheus/0.1.1-2.3.2/img/grafana_datasource.png" alt="Grafana 数据源"/>](/services/prometheus/0.1.1-2.3.2/img/grafana_datasource.png)

图 5. Grafana 数据源

保存并测试。现在，您已准备好将 Prometheus 作为在 Grafana 中的一个数据源加以使用。

要创建图表，选择您的 `Prometheus` 数据源，在“查找”字段中输入任何 Prometheus 表达式，同时使用“度量标准”字段通过自动完成查找度量标准。

以下为 Prometheus 图表配置示例：

[<img src="/services/prometheus/0.1.1-2.3.2/img/grafana_prom.png" alt="Grafana Prom 图表"/>](/services/prometheus/0.1.1-2.3.2/img/grafana_prom.png)

图 6. Grafana Prometheus 图表配置

## AlertManager

AlertManager 处理客户端应用程序（如 Prometheus 服务器）发送的警报。它负责进行重复数据消除、分组以及将它们路由到正确的接收器集成，例如电子邮件、PagerDuty 或 OpsGenie。它还处理警报的消声和抑制。

AlertManager UI：
```
http://<public-agent-ip>:9093
```

[<img src="/services/prometheus/0.1.1-2.3.2/img/am_dashboard.png" alt="AlertManager 仪表板"/>](/services/prometheus/0.1.1-2.3.2/img/am_dashboard.png)

图 7. AlertManager 仪表板


### AlertManager 和 Webhook
在框架中的 AlertManager 的默认配置（可以更改这些配置）带有一个 Webhook 接收器：

```
route:
 group_by: [cluster]
 receiver: webh
 group_interval: 1m

receivers:
- name: webh
  webhook_configs:
  - url: http://webhook.marathon.l4lb.thisdcos.directory:1234
```

框架中定义的默认规则：

```
groups:
- name: cpurule
  rules:
  - alert: highcpu
    expr: cpu_total > 2
    annotations:
      DESCRIPTION: 'it happened yeah'
      SUMMARY: 'it happened'
```

下一步，作为 Marathon 应用运行以下配置：

```
{
    "container": {
        "docker": {
            "image": "python:latest"
        },
        "type": "MESOS"
    },
    "mem": 1024,
    "portDefinitions": [
        {
            "labels": {
                "VIP_0": "webhook:1234"
            },
            "protocol": "tcp",
            "name": "web",
            "port": 1234
        }
    ],
    "cmd": "env | sort\n\ncat > function.py << EOF\n\nimport sys\nimport cgi\nimport json\nimport pipes\nfrom BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer\n\n\nclass MyHandler(BaseHTTPRequestHandler):\n   def do_POST(self):\n       self.send_response(200)\n       self.end_headers()\n       #data = json.loads(self.rfile.read(int(self.headers['Content-Length'])))\n       data = self.rfile.read(int(self.headers['Content-Length']))\n       self.log_message('%s', data)\n\n\nhttpd = HTTPServer(('0.0.0.0', $PORT_WEB), MyHandler)\nhttpd.serve_forever()\nEOF\n\npython2 function.py\n",
    "networks": [
        {
            "mode": "host"
        }
    ],
    "cpus": 0.1,
    "id": "webhook"
}
```


检查此应用的日志。AlertManager 将按以下 JSON 格式发送 HTTP POST 请求：

```
{
  "receiver": "webh",
  "status": "firing",
  "alerts": [
    {
      "status": "firing",
      "labels": {
        "alertname": "highcpu",
        "cluster_id": "4c7ab85b-ce28-4bdd-8a2d-87c71d02759e",
        "hostname": "10.0.1.16",
        "instance": "10.0.1.16:61091",
        "job": "dcos-metrics",
        "mesos_id": "29bac9b2-cbdb-4093-a907-6c4904a1360a-S5"
      },
      "annotations": {
        "DESCRIPTION": "it happened yeah",
        "SUMMARY": "it happened"
      },
      "startsAt": "2018-07-12T17:32:56.030479955Z",
      "endsAt": "0001-01-01T00:00:00Z",
      "generatorURL": "http://ip-10-0-1-16.us-west-2.compute.internal:1025/graph?g0.expr=cpu_total+%3E+2&g0.tab=1"
    },
...
...
...
}
```

### AlertManager 和 Slack

Slack 通知通过 Slack webhook 发送。将 AlertManager 配置更新为：

```
route:
 group_by: [cluster]
 # If an alert isn't caught by a route, send it slack.
 receiver: slack_general
 routes:
  # Send severity=slack alerts to slack.
  - match:
      severity: slack
    receiver: slack_general

receivers:
- name: slack_general
  slack_configs:
  - api_url: <Slack webhook URL>
    channel: '#alerts_test'
```

[<img src="/services/prometheus/0.1.1-2.3.2/img/slack_alert.png" alt="Slack 警报"/>](/services/prometheus/0.1.1-2.3.2/img/slack_alert.png)

图 8. Slack 警报

## PushGateway

Prometheus PushGateway 可以允许暂时和批处理作业将其度量标准公开给 Prometheus。

推动一些度量标准：
将单个样例推送到由 {job="some_job"} 标识的组：

```
echo "some_metric 3.14" | curl --data-binary @- http://pushgateway.example.org:9091/metrics/job/some_job
```

[<img src="/services/prometheus/0.1.1-2.3.2/img/pushg.png" alt="PushGateway"/>](/services/prometheus/0.1.1-2.3.2/img/pushg.png)

图 9. PushGateway
