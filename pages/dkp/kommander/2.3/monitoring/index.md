---
layout: layout.pug
navigationTitle: Monitoring and Alerts
title: Monitoring and Alerts
menuWeight: 180
excerpt: Monitor and collect metrics for Kubernetes, platform services, and applications deployed on the cluster
beta: false
enterprise: false
---

Using DKP you can monitor the state of the cluster and the health and availability of the processes running on the cluster.
By default, Kommander provides monitoring services using a pre-configured monitoring stack based on the Prometheus open-source project and its broader ecosystem.

The default DKP monitoring stack:

- Provides in-depth monitoring of Kubernetes components and platform services.
- Includes a default set of Grafana dashboards to visualize the status of the cluster and its platform services.
- Supports predefined critical error and warning alerts. These alerts notify immediately if there is a problem with cluster operations or availability.

By incorporating Prometheus, Kommander visualizes all the exposed metrics from your different nodes, Kubernetes objects, and platform service applications running in your cluster.
The default monitoring stack also enables you to add metrics from any of your deployed applications, making those applications part of the overall Prometheus metrics stream.

## Cluster metrics

The `kube-prometheus-stack`is deployed by default on the management cluster and attached clusters. This stack deploys the following Prometheus components to expose metrics from nodes, Kubernetes units, and running apps:

- prometheus-operator: orchestrates various components in the monitoring pipeline.
- prometheus: collects metrics, saves them in a time series database, and serves queries.
- alertmanager: handles alerts sent by client applications such as the Prometheus server.
- node-exporter: deployed on each node to collect the machine hardware and OS metrics.
- kube-state-metrics: simple service that listens to the Kubernetes API server and generates metrics about the state of the objects.
- grafana: monitors and visualizes metrics.
- service monitors: collects internal Kubernetes components.

A detailed description of the exposed metrics can be found [in the kube-state-metrics documentation on GitHub][kube_state_exposed_metrics].
The `service-monitors` collect internal Kubernetes components but can also be extended to monitor customer apps as explained [in this section](#monitor-applications).

## Grafana Dashboards

With Grafana, you can query and view collected metrics in easy-to-read graphs.
Kommander ships with a set of default dashboards including:

- Kubernetes Components: API Server, Nodes, Pods, Kubelet, Scheduler, StatefulSets and Persistent Volumes
- Kubernetes USE method: Cluster and Nodes
- Calico
- etcd
- Prometheus

Find the complete list of default enabled dashboards [on GitHub][grafana_default_dashboards].

To disable all of the default dashboards, follow these steps to define an overrides ConfigMap:

1.  Create a file named `kube-prometheus-stack-overrides.yaml` and paste the following YAML code into it to create the overrides ConfigMap:

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: kube-prometheus-stack-overrides
      namespace: <your-workspace-namespace>
    data:
     values.yaml: |
       ---
       grafana:
         defaultDashboardsEnabled: false
    ```

1.  Use the following command to apply the YAML file:

    ```bash
    kubectl apply -f kube-prometheus-stack-overrides.yaml
    ```

1.  Edit the `kube-prometheus-stack` AppDeployment to replace the `spec.configOverrides.name` value with `kube-prometheus-stack-overrides`. (You can use the steps in the procedure, [Deploy an application with a custom configuration](/dkp/kommander/2.2/workspaces/applications/platform-applications/application-deployment/#deploy-an-application-with-a-custom-configuration) as a guide.) When your editing is complete, the AppDeployment will resemble this code sample:

    ```yaml
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: kube-prometheus-stack
      namespace: <your-workspace-namespace>
    spec:
      appRef:
        name: kube-prometheus-stack-34.9.3
        kind: ClusterApp
      configOverrides:
        name: kube-prometheus-stack-overrides
    ```

To access the Grafana UI, browse to the landing page and then search for the Grafana dashboard, for example, `https://<CLUSTER_URL>/dkp/grafana`.

### Add custom dashboards

In Kommander you can define your own custom dashboards. You can use a few methods to [import dashboards][grafana_import_dashboards] to Grafana.

One method is to [use ConfigMaps to import dashboards][grafana_sidecar_dashboards].
Below are steps on how to create a ConfigMap with your dashboard definition.

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

After creating your custom dashboard json, insert it into a ConfigMap and save it as `etcd-custom-dashboard.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: etcd-custom-dashboard
  labels:
    grafana_dashboard: "1"
data:
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

Apply the ConfigMap, which automatically gets imported to Grafana using the [Grafana dashboard sidecar][grafana_sidecar_dashboards]:

```bash
kubectl apply -f etcd-custom-dashboard.yaml
```

## Configure alerts using AlertManager

To keep your clusters and applications healthy and drive productivity forward, you need to stay informed of all events occurring in your cluster.
DKP helps you to stay informed of these events by using the `alertmanager` of the `kube-prometheus-stack`.

Kommander is configured with pre-defined alerts to monitor four specific events. You receive alerts related to:

- State of your nodes
- System services managing the Kubernetes cluster
- Resource events from specific system services
- Prometheus expressions exceeding some pre-defined thresholds

Some examples of the alerts currently available are:

- CPUThrottlingHigh
- TargetDown
- KubeletNotReady
- KubeAPIDown
- CoreDNSDown
- KubeVersionMismatch

A complete list with all the pre-defined alerts can be found [on GitHub][prometheus_rules].

### Use overrides configMaps to configure alert rules

You can enable or disable the default alert rules by providing the desired configuration in an overrides ConfigMap.
For example, if you want to disable the default `node` alert rules, follow these steps to define an overrides ConfigMap:

1.  Create a file named `kube-prometheus-stack-overrides.yaml` and paste the following YAML code into it to create the overrides ConfigMap:

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: kube-prometheus-stack-overrides
      namespace: <your-workspace-namespace>
    data:
     values.yaml: |
       ---
       defaultRules:
         rules:
           node: false
    ```

1.  Use the following command to apply the YAML file:

    ```bash
    kubectl apply -f kube-prometheus-stack-overrides.yaml
    ```

1.  Edit the `kube-prometheus-stack` AppDeployment to replace the `spec.configOverrides.name` value with `kube-prometheus-stack-overrides`. (You can use the steps in the procedure, [Deploy an application with a custom configuration](/dkp/kommander/2.2/workspaces/applications/platform-applications/application-deployment/#deploy-an-application-with-a-custom-configuration) as a guide.) When your editing is complete, the AppDeployment file resembles this code sample:

    ```yaml
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: kube-prometheus-stack
      namespace: <your-workspace-namespace>
    spec:
      appRef:
        name: kube-prometheus-stack-34.9.3
        kind: ClusterApp
      configOverrides:
        name: kube-prometheus-stack-overrides
    ```

To disable all rules, create an overrides ConfigMap with this YAML code:

```bash
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-prometheus-stack-overrides
  namespace: <your-workspace-namespace>
data:
 values.yaml: |
   ---
   defaultRules:
     create: false
```

Alert rules for the Velero platform service are turned off by default. You can enable them with the following overrides ConfigMap. They should be enabled only if the `velero` platform service is enabled. If platform services are disabled disable the alert rules to avoid alert misfires.

```bash
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-prometheus-stack-overrides
  namespace: <your-workspace-namespace>
data:
  values.yaml: |
    ---
    mesosphereResources:
      rules:
        velero: true
```

To create a custom alert rule named `my-rule-name`, create the overrides ConfigMap with this YAML code:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-prometheus-stack-overrides
  namespace: <your-workspace-namespace>
data:
  values.yaml: |
    ---
    additionalPrometheusRulesMap:
      my-rule-name:
        groups:
        - name: my_group
          rules:
          - record: my_record
            expr: 100 * my_record
```

After you set up your alerts, you can manage each alert using the Prometheus web console to mute or unmute firing alerts, and perform other operations.
For more information about configuring `alertmanager`, see the [Prometheus website][alertmanager_config].

To access the Prometheus Alertmanager UI, browse to the landing page and then search for the Prometheus Alertmanager dashboard, for example `https://<CLUSTER_URL>/dkp/alertmanager`.

### Notify Prometheus Alerts in Slack

To hook up the Prometheus `alertmanager` notification system, you need to overwrite the existing configuration.

The following file, named `alertmanager.yaml`, configures `alertmanager` to use the Incoming Webhooks feature of Slack (`slack_api_url: https://hooks.slack.com/services/<HOOK_ID>`) to fire all the alerts to a specific channel `#MY-SLACK-CHANNEL-NAME`.

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

Finally, apply these changes to `alertmanager` as follows. Set `${WORKSPACE_NAMESPACE}` to the workspace namespace that `kube-prometheus-stack` is deployed in:

```bash
kubectl create secret generic -n ${WORKSPACE_NAMESPACE} \
  alertmanager-kube-prometheus-stack-alertmanager \
  --from-file=alertmanager.yaml \
  --from-file=notification.tmpl \
  --dry-run=client --save-config -o yaml | kubectl apply -f -
```

## Monitor applications

Before attempting to monitor your own applications, you should be familiar with the Prometheus conventions for exposing metrics. In general, there are two key recommendations:

- You should expose metrics using an HTTP endpoint named `/metrics`.
- The metrics you expose must be in a format that Prometheus can consume.

By following these conventions, you ensure that your application metrics can be consumed by Prometheus itself or by any Prometheus-compatible tool that can retrieve metrics, using the Prometheus client endpoint.

The `kube-prometheus-stack` for Kubernetes provides easy monitoring definitions for Kubernetes services and deployment and management of Prometheus instances. It provides a Kubernetes resource called `ServiceMonitor`.

By default, the `kube-prometheus-stack` provides the following service monitors to collect internal Kubernetes components:

- kube-apiserver
- kube-scheduler
- kube-controller-manager
- etcd
- kube-dns/coredns
- kube-proxy

The operator is in charge of iterating over all of these `ServiceMonitor` objects and collecting the metrics from these defined components.

The following example illustrates how to retrieve application metrics. In this example, there are:

- Three instances of a simple app named `my-app`
- The sample app listens and exposes metrics on port 8080
- The app is assumed to already be running

To prepare for monitoring of the sample app, create a service that selects the pods that have `my-app` as the value defined for their app label setting.

The service object also specifies the port on which the metrics are exposed. The `ServiceMonitor` has a label selector to select services and their underlying endpoint objects. For example:

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

This service object is discovered by a `ServiceMonitor`, which defines the selector to match the labels with those defined in the service. The app label must have the value `my-app`.

In this example, in order for `kube-prometheus-stack` to discover this `ServiceMonitor`, add a specific label `prometheus.kommander.d2iq.io/select: "true"` in the `yaml`:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: my-app-service-monitor
  namespace: my-namespace
  labels:
    prometheus.kommander.d2iq.io/select: "true"
spec:
  selector:
    matchLabels:
      app: my-app
  endpoints:
  - port: metrics
```

In this example, you would modify the Prometheus settings to have the operator collect metrics from the service monitor by appending the following configuration to the overrides ConfigMap:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-prometheus-stack-overrides
  namespace: <your-workspace-namespace>
data:
  values.yaml: |
    ---
    prometheus:
      additionalServiceMonitors:
        - name: my-app-service-monitor
          selector:
            matchLabels:
              app: my-app
          namespaceSelector:
            matchNames:
              - my-namespace
          endpoints:
            - port: metrics
              interval: 30s
```

Official documentation about using a `ServiceMonitor` to monitor an app with the Prometheus-operator on Kubernetes can be found [on this GitHub repository](https://github.com/coreos/prometheus-operator/blob/master/Documentation/user-guides/getting-started.md#related-resources).

## Set a specific storage capacity for Prometheus

When defining the requirements of a cluster, you can specify the capacity and resource requirements of Prometheus by modifying the settings in the overrides ConfigMap definition as shown below:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: kube-prometheus-stack-overrides
  namespace: <your-workspace-namespace>
data:
  values.yaml: |
    ---
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
[grafana_import_dashboards]: https://github.com/grafana/helm-charts/tree/main/charts/grafana#import-dashboards
[grafana_sidecar_dashboards]: https://github.com/grafana/helm-charts/tree/main/charts/grafana#sidecar-for-dashboards
[grafana_default_dashboards]: https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack/templates/grafana/dashboards-1.14
[prometheus_rules]: https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack/templates/prometheus/rules-1.14
[alertmanager_config]: https://prometheus.io/docs/alerting/configuration/
