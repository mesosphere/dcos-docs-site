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

Run the following commands on the **management** cluster:

1. Execute the following command to get the namespace of your workspace

   ```bash
   kubectl get workspaces
   ```

   Copy the value under `WORKSPACE NAMESPACE` column for your workspace. This may NOT be identical to the Display Name of the `Workspace`.

1. Export the `WORKSPACE_NAMESPACE` variable:

   ```bash
   export WORKSPACE_NAMESPACE=<WORKSPACE_NAMESPACE>
   ```

Run the following commands on the **attached** cluster to access the Grafana UI:

Ensure you switched to the correct [context or kubeconfig](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) of the attached cluster for the following kubectl commands:

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

![View Grafana Loki Logs](/dkp/kommander/2.1/img/lokiGrafanaLogs.gif)

<p class="message--important"><strong>IMPORTANT: </strong>Cert-Manager and Traefik must be deployed in the attached cluster to be able to access the Grafana UI. These are deployed by default on the workspace.</p>
