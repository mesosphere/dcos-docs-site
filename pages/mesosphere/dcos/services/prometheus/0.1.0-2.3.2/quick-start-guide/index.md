---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Configuring Prometheus - Quick Start
title: Quick Start
menuWeight: 15
---

# How to use Prometheus with DC/OS

## Prerequisites

* A running DC/OS 1.11 cluster

## Install

Prometheus can be installed via either the DC/OS Catalog web interface or by using the CLI. The following command will launch the install via the DC/OS CLI:

```bash
dcos package install prometheus
```

Install Grafana from the service catalog as well. It can be used as a graphing tool.
```bash
dcos package install --yes grafana
```

[<img src="/services/prometheus/0.1.0-2.3.2/img/prom_install.png" alt="Prometheus Install"/>](/mesosphere/dcos/services/prometheus/0.1.0-2.3.2/img/prom_install.png)


The framework provides options to enter the Prometheus, AlertManager and Rules config. The default Prometheus configuration scrapes a DC/OS master and agents in the clusters. Append any new config to the end.

## Accessing the Prometheus UI

Once the framework is up and running:
1. Install Edge-LB.
2. Create a file named `prometheus-edgelb.json` containing the following `edge-lb` configuration:

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


3. In your browser enter the following address.

Promtheus UI:
```
http://<public-agent-ip>:9092
```

[<img src="/services/prometheus/0.1.0-2.3.2/img/prom_dashboard.png" alt="Prometheus Dashboard"/>](/mesosphere/dcos/services/prometheus/0.1.0-2.3.2/img/prom_dashboard.png)


This is the console view within the `Graph` tab.

You can also verify that Prometheus is serving metrics about itself by navigating to its metrics endpoint:

```
http://<public-agent-ip>:9092/metrics
```

### Using the Expression browser

Go back to the console view, and enter this into the expression console:

`prometheus_target_interval_length_seconds`

This should return a number of different time series (along with the latest value recorded for each), all with the metric name prometheus_target_interval_length_seconds.

As another example, enter the following expression to graph the per-second rate of chunks being created in the self-scraped Prometheus:

`rate(prometheus_tsdb_head_chunks_created_total[1m])`

[<img src="/services/prometheus/0.1.0-2.3.2/img/prom_graphing.png" alt="Prometheus Graphing"/>](/mesosphere/dcos/services/prometheus/0.1.0-2.3.2/img/prom_graphing.png)

## Using Grafana with Prometheus

```
http://<public-agent-ip>:9094
```

Credentials: admin / admin

[<img src="/services/prometheus/0.1.0-2.3.2/img/grafana_login.png" alt="Grafana Logging"/>](/mesosphere/dcos/services/prometheus/0.1.0-2.3.2/img/grafana_login.png)

which takes you to the Grafana console.


You can add Prometheus as a data source:

[<img src="/services/prometheus/0.1.0-2.3.2/img/grafana_datasource.png" alt="Grafana Data Source"/>](/mesosphere/dcos/services/prometheus/0.1.0-2.3.2/img/grafana_datasource.png)


Save and Test. Now you are ready to use Prometheus as a data source in Grafana.

To create a graph, select your `Prometheus` datasource, and enter any Prometheus expression into the "Query" field, while using the "Metric" field to lookup metrics via autocompletion.

The following shows an example Prometheus graph configuration:

[<img src="/services/prometheus/0.1.0-2.3.2/img/grafana_prom.png" alt="Grafana Prom Graph"/>](/mesosphere/dcos/services/prometheus/0.1.0-2.3.2/img/grafana_prom.png)

## Alertmanager

The Alertmanager handles alerts sent by client applications such as the Prometheus server. It takes care of deduplicating, grouping, and routing them to the correct receiver integration such as email, PagerDuty, or OpsGenie. It also takes care of silencing and inhibition of alerts.

Alertmanager UI:
```
http://<public-agent-ip>:9093
```

[<img src="/services/prometheus/0.1.0-2.3.2/img/am_dashboard.png" alt="AlertManager Dashboard"/>](/mesosphere/dcos/services/prometheus/0.1.0-2.3.2/img/am_dashboard.png)


### Alertmanager with Webhook
The default configuration for Alertmanager (these configurations can be changed) in the framework is configured with a Webhook receiver:

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

Default rule defined in the framework:

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

Next, run the following config as a Marathon app:

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


Check the logs for this app. The Alertmanager will send HTTP POST requests in the following json format:

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

### Alertmanager with Slack

Slack notifications are sent via Slack webhooks. Update the Alertmanager config to :

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

[<img src="/services/prometheus/0.1.0-2.3.2/img/slack_alert.png" alt="Slack Alerts"/>](/mesosphere/dcos/services/prometheus/0.1.0-2.3.2/img/slack_alert.png)


## PushGateway

The Prometheus Pushgateway exists to allow ephemeral and batch jobs to expose their metrics to Prometheus.

Pushing some metrics:
Push a single sample into the group identified by {job="some_job"}:

```
echo "some_metric 3.14" | curl --data-binary @- http://pushgateway.example.org:9091/metrics/job/some_job
```

[<img src="/services/prometheus/0.1.0-2.3.2/img/pushg.png" alt="PushGateway"/>](/mesosphere/dcos/services/prometheus/0.1.0-2.3.2/img/pushg.png)
