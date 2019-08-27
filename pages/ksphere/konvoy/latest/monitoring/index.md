---
layout: layout.pug
navigationTitle: Monitoring and metrics
title: Monitoring and metrics
menuWeight: 11
excerpt: Monitor and collect metrics for Kubernetes, platform services, and applications deployed on the Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Konvoy enables you to monitor both the state of the cluster itself and the health and availability of the processes running on the cluster.
By default, Konvoy provides monitoring services using a pre-configured monitoring stack based on the Prometheus open-source project and its broader ecosystem.

The default Konvoy monitoring stack:

* Provides in-depth monitoring of Kubernetes components and Konvoy platform service add-ons.
* Includes a default set of Grafana dashboard to help you visualize the status of the cluster and its add-on services
* Supports predefined critical error and warning alerts to immediately notify you if there is a problem with cluster operations or availability.

By incorporating Prometheus, Konvoy helps you visualize all the exposed metrics from your different nodes, Kubernetes objects, and addon applications running in your cluster.
The default monitoring stack also enables you to add metrics from any of your deployed applications, making those applications part of the overall Prometheus metrics stream.

![monitoring-stack](monitoring.png)

In the diagram above, the main components of the monitoring stack and their mission are shown for a Konvoy cluster.

## Cluster metrics

Once Prometheus is enabled in Konvoy, it installs the `prometheus-operator` to create/configure/manage Prometheus clusters atop Kubernetes.

The `prometheus-operator` deploys the following set of Prometheus components to expose metrics from nodes, Kubernetes units, and running apps:

* prometheus-operator: orchestrates various components in the monitoring pipeline.
* prometheus: collects metrics, saves them in a time series database, and serves queries.
* alertmanager: handles alerts sent by client applications such as the Prometheus server.
* node-exporter: is deployed on each node to collect the machine hardware and OS metrics.
* kube-state-metrics: is a simple service that listens to the Kubernetes API server and generates metrics about the state of the objects.
* grafana: is used to monitor and visualize metrics.
* service monitors: collects internal Kubernetes components.

A detailed description of the exposed metrics can be found [here][kube_state_exposed_metrics].
The `service-monitors` collect internal Kubernetes components but they can also be extended to monitor customer apps as explained [here](#monitoring-applications).

## Grafana Dashboards

With Grafana, you can query and view collected metrics in easy-to-read graphs.
Konvoy ships with the following set of default dashboards:

* Kubernetes Components: Nodes, Pods, Kubelet, Scheduler, StatefulSets and Persistent Volumes
* Kubernetes USE method: Cluster and Nodes
* Traefik
* CoreDNS
* Grafana
* Kube-Apiserver
* Local Volume Provisioner
* Etcd
* Prometheus
* FluentBit
* Volume Space Usage
* Elasticsearch
* Velero

Initially, all of the dashboards are enabled by default.
However, you can disable any of them when defining the cluster requirements for Prometheus in the `cluster.yaml` file.

For example, if you want to disable the `elasticsearch` and `traefik` dashboards, you can modify the `cluster.yaml` file as follows:

```yaml
- name: prometheus
  enabled: true
  values: |
    mesosphereResources:
     create: true
     dashboards:
       apiserver: true
       calico: true
       controlmanager: true
       elasticsearch: false
       grafana: true
       kubelet: true
       localvolumeprovisioner: true
       localvolumeusage: true
       prometheusoverview: true
       scheduler: true
       traefik: false
       velero: true
```

Similarly, you could disable all of the default dashboards by setting the `defaultDashboardsEnabled` property to `false` under Prometheus in the `cluster.yaml` file.
For example:

```yaml
- name: prometheus
  enabled: true
  values: |
    grafana:
     defaultDashboardsEnabled: false  
```

To access the Grafana UI, you can browse to the landing page and then search for the Grafana dashboard, e.g. `https://<CLUSTER_URL>/ops/portal/grafana`.

### Adding custom dashboards

Konvoy also allows you to define your own custom dashboards.
There are a few methods to [import dashboards][grafana_import_dashboards] to Grafana.
For simplicity, this section assumes the desired dashboard definition is in `json` format:

```json
{
    "annotations": {
        "list": []
    },
    "description": "etcd sample Grafana dashboard with Prometheus",
    "editable": true,
    "gnetId": null,
    "hideControls": false,
    "id": 6,
    "links": [],
    "refresh": false,
    ...
}
```

After you decide how to create your custom dashboard, you can configure it when deploying Prometheus by modifying the `cluster.yaml` file as follows:

```yaml
- name: prometheus
  enabled: true
  values: |
    grafana:
      dashboard:
        default:
          some-dashboard:
            etcd.json: |
              {
                  "annotations": {
                      "list": []
                  },
                  "description": "etcd sample Grafana dashboard with Prometheus",
                  "editable": true,
                  "gnetId": null,
                  "hideControls": false,
                  "id": 6,
                  "links": [],
                  "refresh": false,
                  ...
              }  
```

## Configuring alerts using AlertManager

To keep your clusters and applications healthy and drive your productivity forward, you need to stay informed of all events occurring in your cluster.
Konvoy helps you to stay informed of these events by using the `alertmanager` of the `prometheus-operator`.

Konvoy is configured with some pre-defined alerts to monitor for specific events and to send you alerts related to:

* State of your nodes
* System services managing the Kubernetes cluster
* Resource events from specific system services
* Prometheus expressions exceeding some pre-defined thresholds

Some examples of the alerts currently available are:

* CPUThrottlingHigh
* TargetDown
* KubeletNotReady
* KubeAPIDown
* CoreDNSDown
* KubeVersionMismatch

A complete list with all the pre-defined alerts can be found [here][prometheus_rules].

You can disable the default alert rules in the `cluster.yaml` file by providing the desired configuration.
For example, if you want to disable the default `etcd` and `node` alert rules, you can modify the Prometheus section in the `cluster.yaml` file as follows:

```yaml
- name: prometheus
  enabled: true
  values: |
    defaultRules:
      rules:
        etcd: false
        node: false
```

Alert rules for the Velero platform service add-on are turned off by default.
You can enable them in the `cluster.yaml` file by providing the desired configuration.
They should be enabled only if the add-on is enabled.
If the add-on is disabled, the alert rules should also be disabled to avoid alert misfires.

```yaml
- name: prometheus
  enabled: true
  values: |
    mesosphereResources:
     create: true
     rules:
       velero: true
```

To create a custom alert rule named `my-rule-file`, you can modify the Prometheus definition in the `cluster.yaml` file as follows:

```yaml
- name: prometheus
  enabled: true
  values: |
    additionalPrometheusRules:
    - name: my-rule-file
      groups:
        - name: my_group
          rules:
          - record: my_record
            expr: 100 * my_record
```

After you set up your alerts, you can manage each alert using the Prometheus web console to mute/unmute firing alerts, as well as to perform other operations.
For more information about configuring the `alertmanager`, see the [Prometheus website][alertmanager_config].

To access the Prometheus Alertmanager UI, you can browse to the landing page and then search for the Prometheus Alertmanager dashboard, e.g. `https://<CLUSTER_URL>/ops/portal/alertmanager`.

### Notify Prometheus Alerts in Slack

To hook up the Prometheus `alertmanager` notification system, you need to overwrite the existing configuration.

The following file, named `alertmanager.yaml`, configures the `alertmanager` to use the Incoming Webhooks feature of Slack (`slack_api_url: https://hooks.slack.com/services/<HOOK_ID>`) to fire all the alerts to a specific channel `#MY-SLACK-CHANNEL-NAME`.

```yaml
global:
  resolve_timeout: 5m
  slack_api_url: https://hooks.slack.com/services/<HOOK_ID>

route:
  group_by: ['alertname']
  group_wait: 2m
  group_interval: 5m
  repeat_interval: 1h

  # If an alert isn't caught by a route, send it to slack.
  receiver: slack_general
  routes:
    - match:
        alertname: Watchdog
      receiver: "null"

receivers:
  - name: "null"
  - name: slack_general
    slack_configs:
      - channel: '#MY-SLACK-CHANNEL-NAME'
        icon_url: https://avatars3.githubusercontent.com/u/3380462
        send_resolved: true
        color: '{{ if eq .Status "firing" }}danger{{ else }}good{{ end }}'
        title: '{{ template "slack.default.title" . }}'
        title_link: '{{ template "slack.default.titlelink" . }}'
        pretext: '{{ template "slack.default.pretext" . }}'
        text: '{{ template "slack.default.text" . }}'
        fallback: '{{ template "slack.default.fallback" . }}'
        icon_emoji: '{{ template "slack.default.iconemoji" . }}'

templates:
  - '*.tmpl'
```

The following file, named  `notification.tmpl`, is a template that defines a pretty format for the fired notifications:

```text
{{ define "__titlelink" }}
{{ .ExternalURL }}/#/alerts?receiver={{ .Receiver }}
{{ end }}

{{ define "__title" }}
[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}] {{ .GroupLabels.SortedPairs.Values | join " " }}
{{ end }}

{{ define "__text" }}
{{ range .Alerts }}
{{ range .Labels.SortedPairs }}*{{ .Name }}*: `{{ .Value }}`
{{ end }} {{ range .Annotations.SortedPairs }}*{{ .Name }}*: {{ .Value }}
{{ end }} *source*: {{ .GeneratorURL }}
{{ end }}
{{ end }}

{{ define "slack.default.title" }}{{ template "__title" . }}{{ end }}
{{ define "slack.default.username" }}{{ template "__alertmanager" . }}{{ end }}
{{ define "slack.default.fallback" }}{{ template "slack.default.title" . }} | {{ template "slack.default.titlelink" . }}{{ end }}
{{ define "slack.default.pretext" }}{{ end }}
{{ define "slack.default.titlelink" }}{{ template "__titlelink" . }}{{ end }}
{{ define "slack.default.iconemoji" }}{{ end }}
{{ define "slack.default.iconurl" }}{{ end }}
{{ define "slack.default.text" }}{{ template "__text" . }}{{ end }}
```

Finally, we need to apply these changes to the `alertmanager`, as follows:

```bash
kubectl create secret generic -n kubeaddons \
  alertmanager-prometheus-kubeaddons-prom-alertmanager \
  --from-file=alertmanager.yaml \
  --from-file=notification.tmpl \
  --dry-run -o yaml | kubectl apply -f -
```

## Monitoring applications

Before you attempt to monitor your own applications, you should be familiar with Prometheus conventions for exposing metrics.
In general, there are two key recommendations:

* You should expose metrics using an HTTP endpoint named `/metrics`.
* The metrics you expose must be in a format that Prometheus can consume.

By following these conventions, you can ensure that your application metrics can be consumed by Prometheus itself or by any Prometheus-compatible tool that can retrieve metrics using the Prometheus client endpoint.

The `prometheus-operator` for Kubernetes provides easy monitoring definitions for Kubernetes services and deployment and management of Prometheus instances.
It provides a Kubernetes resource called `ServiceMonitor`.

By default, the `prometheus-operator` provides the following service monitors to collect internal Kubernetes components:

* kube-apiserver
* kube-scheduler
* kube-controller-manager
* etcd
* kube-dns/coredns
* kube-proxy

The operator is in charge of iterating over all of these `ServiceMonitor` objects and collecting the metrics from these defined components.

The following example illustrates how to retrieve application metrics. In this example:

* There are three instances of a simple app named `my-app`
* The sample app listens and exposes metrics on port 8080
* The app is assumed to already be running

To prepare for monitoring of the sample app, you can create a service that selects the pods that have `my-app` as the value defined for their app label setting.

The service object also specifies the port on which the metrics are exposed.
The `ServiceMonitor` has a label selector to select services and their underlying endpoint objects.
For example:

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-app
  namespace: my-namespace
  labels:
    app: my-app
spec:
  selector:
    app: my-app
  ports:
  - name: metrics
    port: 8080
```

This service object is discovered by a `ServiceMonitor`, which defines the selector to match the labels with those defined in the service.
The app label must have the value `servicemonitor.myapp.io/path: "metrics"`.

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app
  namespace: my-namespace
  labels:
    servicemonitor.myapp.io/path: "metrics"
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
  - port: metrics
```

In this example, you would modify the Prometheus settings to have the operator collect metrics from the service monitor by appending the following configuration in the `cluster.yaml` file:

```yaml
- name: prometheus
  enabled: true
  values: |
    prometheus:
      additionalServiceMonitors:
        - name: my-app-service-monitor
          selector:
            matchLabels:
              servicemonitor.myapp.io/path: "metrics"
          namespaceSelector:
            matchNames:
              - my-namespace
          endpoints:
            - port: metrics
              interval: 30s  
```

## Set a specific storage capacity for Prometheus

When defining the requirements of a Konvoy cluster, you can specify the capacity and resource requirements of Prometheus by modifying the settings in the `cluster.yaml` definition to your desire, as shown below:

```yaml
- name: prometheus
  enabled: true
  values: |
    prometheus:
      prometheusSpec:
        resources:
          limits:
            cpu: "4"
            memory: "8Gi"
          requests:
            cpu: "2"
            memory: "6Gi"
      storageSpec:
        volumeClaimTemplate:
          spec:
            resources:
              requests:
                storage: "100Gi"
```

[kube_state_exposed_metrics]: https://github.com/kubernetes/kube-state-metrics/tree/master/docs#exposed-metrics
[grafana_import_dashboards]: https://github.com/helm/charts/tree/master/stable/grafana#import-dashboards
[prometheus_rules]: https://github.com/helm/charts/tree/master/stable/prometheus-operator/templates/prometheus/rules
[alertmanager_config]: https://prometheus.io/docs/alerting/configuration/
