---
layout: layout.pug
navigationTitle: Configuring DC/OS access for Prometheus
excerpt: How to use Prometheus with DC/OS
title: Configuring DC/OS access for Prometheus
menuWeight: 3
---

This section will explain how to configure Prometheus for use with DC/OS.

## Prerequisites

- A running DC/OS 1.11 cluster

## Install

Prometheus can be installed via either the DC/OS Catalog web interface or by using the CLI. The following command will launch the install via the DC/OS CLI:

```bash
dcos package install prometheus --yes
```

[<img src="/services/prometheus/0.1.1-2.3.2/img/prom_install.png" alt="Prometheus Install"/>](/services/prometheus/0.1.1-2.3.2/img/prom_install.png)

Figure 1. Installing Prometheus


Install Grafana from the service catalog as well. It can be used as a graphing tool.
```bash
dcos package install grafana --yes
```

The framework provides options to enter the Prometheus, AlertManager and Rules config. The default Prometheus configuration scrapes a DC/OS master and agents in the clusters. The framework allows users to append any new config to the end for full extensibility.

## Accessing the Prometheus UI with EdgeLB (Enterprise Feature)

Once the framework is up and running:
1. [Install EdgeLB](https://docs.mesosphere.com/services/edge-lb/1.1/installing/).
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

Description of the EdgeLB configuration above:
- Exposes Prometheus Pushgateway UI at `http://<public-agent-ip>:9091`
- Exposes Prometheus UI at `http://<public-agent-ip>:9092`
- Exposes Prometheus Alertmanager UI at `http://<public-agent-ip>:9093`
- Exposes Grafana UI at `http://<public-agent-ip>:9094`

3. Deploy the `edge-lb` service configuration above using:
```
dcos edgelb create prometheus-edgelb.json
```

## Accessing the Prometheus UI using MarathonLB (OSS)

1. Install Marathon-LB
```
dcos package install marathon-lb --yes
```

2. Create a file named `prometheus-marathonlb.json` containing the following `marathon-lb` proxy configuration:
```
{
  "id": "/prometheus-proxy",
  "instances": 1,
  "cpus": 0.001,
  "mem": 16,
  "cmd": "tail -F /dev/null",
  "container": {
    "type": "MESOS"
  },
  "portDefinitions": [
    {
      "protocol": "tcp",
      "port": 0
    },
    {
      "protocol": "tcp",
      "port": 0
    },
    {
      "protocol": "tcp",
      "port": 0
     },
  {
      "protocol": "tcp",
      "port": 0
     }
  ],
  "labels": {
    "HAPROXY_GROUP": "external",
    "HAPROXY_0_MODE": "http",
    "HAPROXY_0_PORT": "9092",
    "HAPROXY_0_BACKEND_SERVER_OPTIONS": "server prometheus prometheus.prometheus.l4lb.thisdcos.directory:9090",
    "HAPROXY_1_MODE": "http",
    "HAPROXY_1_PORT": "9093",
    "HAPROXY_1_BACKEND_SERVER_OPTIONS": "server alertmanager alertmanager.prometheus.l4lb.thisdcos.directory:9093",
    "HAPROXY_2_MODE": "http",
    "HAPROXY_2_PORT": "9091",
    "HAPROXY_2_BACKEND_SERVER_OPTIONS": "server pushgateway pushgateway.prometheus.l4lb.thisdcos.directory:9091",
    "HAPROXY_3_MODE": "http",
    "HAPROXY_3_PORT": "9094",
    "HAPROXY_3_BACKEND_SERVER_OPTIONS": "server grafana grafana.grafana.l4lb.thisdcos.directory:3000"
  }
}
```

Description of the Marathon-LB configuration above:
- Exposes Prometheus Pushgateway UI at `http://<public-agent-ip>:9091`
- Exposes Prometheus UI at `http://<public-agent-ip>:9092`
- Exposes Prometheus Alertmanager UI at `http://<public-agent-ip>:9093`
- Exposes Grafana UI at `http://<public-agent-ip>:9094`

### Navigate to the Service UI
Enter the following address in your browser:
```
http://<public-agent-ip>:9092
```

You should see the Prometheus UI:
[<img src="/services/prometheus/0.1.1-2.3.2/img/prom_dashboard.png" alt="Prometheus Dashboard"/>](/services/prometheus/0.1.1-2.3.2/img/prom_dashboard.png)
Figure 2. Prometheus dashboard


You can also verify that Prometheus is serving metrics about itself by navigating to its metrics endpoint:

```
http://<public-agent-ip>:9092/metrics
```

### Using the Expression browser

Go back to the console view, and enter this into the expression console:

`prometheus_target_interval_length_seconds`

This should return a number of different time series (along with the latest value recorded for each), all with the metric name `prometheus_target_interval_length_seconds`.

As another example, enter the following expression to graph the per-second rate of chunks being created in the self-scraped Prometheus:

`rate(prometheus_tsdb_head_chunks_created_total[1m])`

[<img src="/services/prometheus/0.1.1-2.3.2/img/prom_graphing.png" alt="Prometheus Graphing"/>](/services/prometheus/0.1.1-2.3.2/img/prom_graphing.png)

Figure 3. Prometheus graphing

## Using Grafana with Prometheus

Navigate to the following URL using the credentials `admin/admin`.

```
http://<public-agent-ip>:9094
```

This takes you to the Grafana console.

[<img src="/services/prometheus/0.1.1-2.3.2/img/grafana_login.png" alt="Grafana Logging"/>](/services/prometheus/0.1.1-2.3.2/img/grafana_login.png)

Figure 4. Grafana console.


You can add Prometheus as a data source:

The default installation URL is `http://prometheus-0-server.prometheus.autoip.dcos.thisdcos.directory:1025`

**Note:** your data source will not register without `http://` in front of the URL

[<img src="/services/prometheus/0.1.1-2.3.2/img/grafana_datasource.png" alt="Grafana Data Source"/>](/services/prometheus/0.1.1-2.3.2/img/grafana_datasource.png)

Figure 5. Grafana data source

Save and Test. Now you are ready to use Prometheus as a data source in Grafana.

### Create a Dashboard
To create a graph, select your `Prometheus` data source, and enter any Prometheus expression into the "Query" field, while using the "Metric" field to lookup metrics via autocompletion.

The following shows an example Prometheus graph configuration using the variable `rate(prometheus_http_request_duration_seconds_count[5m])`

[<img src="/services/prometheus/0.1.1-2.3.2/img/grafana_prom.png" alt="Grafana Prom Graph"/>](/services/prometheus/0.1.1-2.3.2/img/grafana_prom.png)

Figure 6. Grafana Prometheus graph configuration

## AlertManager

The AlertManager handles alerts sent by client applications such as the Prometheus server. It takes care of deduplicating, grouping, and routing them to the correct receiver integration such as email, PagerDuty, or OpsGenie. It also takes care of silencing and inhibition of alerts.

AlertManager UI:
```
http://<public-agent-ip>:9093
```

[<img src="/services/prometheus/0.1.1-2.3.2/img/am_dashboard.png" alt="AlertManager Dashboard"/>](/services/prometheus/0.1.1-2.3.2/img/am_dashboard.png)

Figure 7. AlertManager dashboard


### AlertManager with Webhook
The default configuration for AlertManager (these configurations can be changed) in the framework is configured with a Webhook receiver:

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


Check the logs for this app. The AlertManager will send HTTP POST requests in the following JSON format:

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

### AlertManager with Slack

Slack notifications are sent via Slack webhooks. Update the AlertManager config to:

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

[<img src="/services/prometheus/0.1.1-2.3.2/img/slack_alert.png" alt="Slack Alerts"/>](/services/prometheus/0.1.1-2.3.2/img/slack_alert.png)

Figure 8. Slack alerts

## PushGateway

The Prometheus PushGateway exists to allow ephemeral and batch jobs to expose their metrics to Prometheus.

Pushing some metrics:
Push a single sample into the group identified by {job="some_job"}:

```
echo "some_metric 3.14" | curl --data-binary @- http://pushgateway.example.org:9091/metrics/job/some_job
```

[<img src="/services/prometheus/0.1.1-2.3.2/img/pushg.png" alt="PushGateway"/>](/services/prometheus/0.1.1-2.3.2/img/pushg.png)

Figure 9. PushGateway
