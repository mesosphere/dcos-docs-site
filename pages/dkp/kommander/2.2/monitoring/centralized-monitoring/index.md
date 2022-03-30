---
layout: layout.pug
navigationTitle: Centralized Monitoring
title: Centralized Monitoring
menuWeight: 20
beta: false
excerpt: Monitor clusters, created with Kommander, on any attached cluster
---

<!-- markdownlint-disable MD030 -->

Kommander provides centralized monitoring, in a multi-cluster environment, using the monitoring stack running on any attached clusters. Centralized monitoring is provided by default in every Kommander cluster.

Attached clusters are distinguished by a monitoring ID.
The monitoring ID corresponds to the kube-system namespace UID of the cluster.
To find a cluster's monitoring ID, you can go to the Clusters tab on the DKP UI (in the relevant workspace), or go to the **Clusters** page in the **Global** workspace:

```bash
https://<CLUSTER_URL>/dkp/kommander/dashboard/clusters
```

Select the `View Details` link on the attached cluster card, and then select the **Configuration** tab, and find the monitoring ID under **Monitoring ID (clusterId)**.

You may also search or filter by monitoring IDs on the Clusters page, linked above.

You can also run this kubectl command, **using the correct cluster's context or kubeconfig**, to look up the cluster's kube-system namespace UID to determine which cluster the metrics and alerts correspond to:

```bash
kubectl get namespace kube-system -o jsonpath='{.metadata.uid}'
```

## Centralized Metrics

The Kommander cluster collects and presents metrics from all attached clusters remotely using Thanos.
You can visualize these metrics in Grafana using a set of provided dashboards.

The [Thanos Query][thanos_query] component is installed on the Kommander cluster.
Thanos Query queries the Prometheus instances on the attached clusters, using a Thanos sidecar running alongside each Prometheus container.
Grafana is configured with Thanos Query as its datasource, and comes with pre-installed dashboards for a global view of all attached clusters.
The `Thanos Query` dashboard is also installed, by default, to monitor the Thanos Query component.

<p class="message--note"><strong>NOTE: </strong>Metrics from clusters are read remotely from Kommander; they are not backed up.
If a attached cluster goes down, Kommander no longer collects or presents its metrics, including past data.</p>

You can access the centralized Grafana UI at:

```bash
https://<CLUSTER_URL>/dkp/kommander/monitoring/grafana
```

<p class="message--note"><strong>NOTE: </strong>This is a separate Grafana instance than the one installed on all attached clusters. It is dedicated specifically to components related to centralized monitoring.</p>

Optionally, if you want to access the Thanos Query UI (essentially the Prometheus UI), the UI is accessible at:

```bash
https://<CLUSTER_URL>/dkp/kommander/monitoring/query
```

You can also check that the attached cluster's Thanos sidecars are successfully added to Thanos Query by going to:

```bash
https://<CLUSTER_URL>/dkp/kommander/monitoring/query/stores
```

The preferred method to view the metrics for a specific cluster is to go directly to that cluster's Grafana UI.

### Adding custom dashboards

You can also define custom dashboards for centralized monitoring on Kommander.
There exists a few methods to [import dashboards][grafana_import_dashboards] to Grafana.
For simplicity, assume the desired dashboard definition is in `json` format:

```json
{
    "annotations":
    ...
    # Complete json file here
    ...
    "title": "Some Dashboard",
    "uid": "abcd1234",
    "version": 1
}
```

After creating your custom dashboard json, insert it into a ConfigMap and save it as `some-dashboard.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: some-dashboard
  labels:
    grafana_dashboard_kommander: "1"
data:
  some_dashboard.json: |
    {
      "annotations":
      ...
      # Complete json file here
      ...
      "title": "Some Dashboard",
      "uid": "abcd1234",
      "version": 1
    }
```

Apply the ConfigMap, which will automatically get imported to Grafana via the Grafana dashboard sidecar:

```bash
kubectl apply -f some-dashboard.yaml
```

## Centralized Alerts

A centralized view of alerts, from attached clusters, is provided using an alert dashboard called [Karma][karma_docs].
Karma aggregates all alerts from the Alertmanagers running in the attached clusters, allowing you to visualize these alerts on one page.
Using the Karma dashboard, you can get an overview of each alert and filter by alert type, cluster, and more.

<p class="message--note"><strong>NOTE: </strong>Silencing alerts using the Karma UI is currently not supported.</p>

You can access the Karma dashboard UI at:

```bash
https://<CLUSTER_URL>/dkp/kommander/monitoring/karma
```

<p class="message--note"><strong>NOTE: </strong>When there are no attached clusters, the Karma UI displays an error message <code>Get https://placeholder.invalid/api/v2/status: dial tcp: lookup placeholder.invalid on 10.0.0.10:53: no such host</code>.
This is expected, and the error disappears when clusters are connected.</p>

### Federating Prometheus Alerting Rules

You can define additional [Prometheus alerting rules][alerting_rules] on the Kommander cluster and federate them to all of the attached clusters by following these instructions.
To use these instructions you must [install the kubefedctl CLI][kubefedctl].

1. Enable the PrometheusRule type for federation.

   ```bash
   kubefedctl enable PrometheusRules --kubefed-namespace kommander
   ```

1. Modify the existing alertmanager configuration.

   ```bash
   kubectl edit PrometheusRules/kube-prometheus-stack-alertmanager.rules -n kommander
   ```

1. Append a sample rule.

   ```yaml
   - alert: MyFederatedAlert
     annotations:
       message: A custom alert that will always fire.
     expr: vector(1)
     labels:
       severity: warning
   ```

1. Federate the rules you just modified.

   ```bash
   kubefedctl federate PrometheusRules kube-prometheus-stack-alertmanager.rules --kubefed-namespace kommander -n kommander
   ```

1. Ensure that the clusters selection (`status.clusters`) is appropriately set for your desired federation strategy and check the [propagation status][kubefed_status_docs].

   ```bash
   kubectl get federatedprometheusrules kube-prometheus-stack-alertmanager.rules -n kommander -oyaml
   ```

[alerting_rules]: https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/
[grafana_import_dashboards]: https://github.com/mesosphere/charts/tree/master/stable/grafana#import-dashboards
[karma_docs]: https://github.com/prymitive/karma
[kubefed_status_docs]: https://github.com/kubernetes-sigs/kubefed/blob/master/docs/userguide.md#propagation-status
[kubefedctl]: https://github.com/kubernetes-sigs/kubefed/blob/master/docs/installation.md#kubefedctl-cli
[thanos_query]: https://thanos.io/v0.5/components/query/#query
