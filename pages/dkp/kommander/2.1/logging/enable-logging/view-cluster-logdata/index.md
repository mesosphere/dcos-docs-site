---
layout: layout.pug
navigationTitle: View Cluster Log Data
title: View Cluster Log Data
menuWeight: 20
excerpt: How to view the cluster's log data after enabling logging
beta: false
---

<!-- markdownlint-disable MD030 -->

Though you enable logging at the Workspace level, viewing the log data is done at the cluster level, using the cluster's Grafana logging URL.

Run the following commands on the attached cluster to access the Grafama UI:

1. Set the `WORKSPACE_NAMESPACE` environment variable needed for this procedure using the command to get the name of the workspace's namespace:

   ``` bash
   export WORKSPACE_NAMESPACE=$(kubectl get workspace <type_your_workspace_name> -o jsonpath='{.status.namespaceRef.name}')
   ```

1. Get the Grafana URL:

   ```bash
   kubectl get ingress -n ${WORKSPACE_NAMESPACE} grafana-logging -o go-template='https://{{with index .status.loadBalancer.ingress 0}}{{or .hostname .ip}}{{end}}{{with index .spec.rules 0}}{{with index .http.paths 0}}{{.path }}{{end}}{{end}}{{"\n"}}'
   ```

To view logs in Grafana:

1. Go to the Explore tab:

   ```bash
   kubectl get ingress -n ${WORKSPACE_NAMESPACE} grafana-logging -o go-template='https://{{with index .status.loadBalancer.ingress 0}}{{or .hostname .ip}}{{end}}{{with index .spec.rules 0}}{{with index .http.paths 0}}{{.path }}{{end}}{{end}}/explore{{"\n"}}'
   ```

1.  You may be prompted to log in using the SSO flow. See [Kommander Security](../../../security/distributed-authnz/) for more information.

1.  At the top of the page, change the datasource to `Loki`.

See the [Grafana Loki documentation](https://grafana.com/docs/grafana/v7.5/datasources/loki/) for more on how to use the interface to view and query logs.

![View Grafana Loki Logs](/dkp/kommander/2.0/img/lokiGrafanaLogs.gif)

<p class="message--important"><strong>IMPORTANT: </strong>Cert-Manager and Traefik must be deployed in the attached cluster to be able to access the Grafana UI. These are deployed by default on the workspace.</p>
