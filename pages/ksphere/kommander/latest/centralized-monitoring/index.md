---
layout: layout.pug
navigationTitle: Centralized Monitoring
title: Centralized Monitoring
menuWeight: 7
excerpt: Monitor clusters created with Kommander or any connected Konvoy cluster
---

Kommander provides centralized monitoring in a multi-cluster environment using the monitoring stack running on managed Konvoy clusters.
Centralized monitoring is provided by default in every Kommander cluster.

Managed Konvoy clusters are distinguished by a cluster ID.
The cluster ID corresponds to the kube-system namespace UID of the cluster.
You can run this kubectl command, **using the correct cluster's context or kubeconfig**, to look up the cluster's kube-system namespace UID to determine which cluster the metrics and alerts correspond to:

```bash
$ kubectl get namespace kube-system -o jsonpath='{.metadata.uid}'
```

## Centralized Metrics

Metrics are aggregated from all managed Konvoy clusters, up to the Kommander cluster, using Thanos.
You can visualize these metrics in Grafana using a set of provided dashboards.
The [Thanos Query][thanos_query] component is installed on the Kommander cluster. The component queries the Prometheus instances, running on the managed clusters, using a Thanos sidecar running alongside each Prometheus container.
Grafana is configured with Thanos Query as its datasource, and comes with a pre-installed dashboard for a global view of all managed clusters, named `Kubernetes / Compute Resources / Clusters `.
The `Thanos Query` dashboard is also installed, by default, to monitor the Thanos Query component.

You can access the centralized Grafana UI at:

```
https://<CLUSTER_URL>/ops/portal/kommander/monitoring/grafana
```

<p class="message--note"><strong>NOTE: </strong>This is a separate Grafana instance than the one installed on all Konvoy clusters.
It is dedicated specifically to components related to centralized monitoring.</p>

Optionally, if you want to access the Thanos Query UI (essentially the Prometheus UI), the UI is exposed at:

```
https://<CLUSTER_URL>/ops/portal/kommander/monitoring/query
```

You can also check that the managed cluster's Thanos sidecars are successfully added to Thanos Query by navigating to:

```
https://<CLUSTER_URL>/ops/portal/kommander/monitoring/query/stores
```

The preferred method to view a specific cluster's metrics is to go directly to that cluster's Grafana UI.

### Adding custom dashboards

You can also define custom dashboards for centralized monitoring on Kommander.
There are a few methods to [import dashboards][grafana_import_dashboards] to Grafana.
For simplicity, assume the desired dashboard definition is in `json` format:

```json
{
    "annotations":
    ...
    "title": "Some Dashboard",
    "uid": "abcd1234",
    "version": 1
}
```

After creating your custom dashboard, configure Kommander to deploy it by modifying the `cluster.yaml` file as follows:

```yaml
- name: kommander
  enabled: true
  values: |
    grafana:
      dashboards:
        default:
          some-dashboard:
            json: |
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

## Centralized Alerts

A centralized view of alerts, from managed Konvoy clusters, is provided using an alert dashboard called [Karma][karma_docs].
Karma aggregates all alerts from the Alertmanagers running in the managed clusters and allows you to visualize these alerts all on one page.
Using the Karma dashboard, you can get an overview of each alert and filter by alert type, cluster, and more.
Silencing alerts using the Karma UI is currently not supported.

You can access the Karma dashboard UI at:

```
https://<CLUSTER_URL>/ops/portal/kommander/monitoring/karma
```

[thanos_query]: https://thanos.io/components/query.md/
[grafana_import_dashboards]: https://github.com/helm/charts/tree/master/stable/grafana#import-dashboards
[karma_docs]: https://github.com/prymitive/karma

