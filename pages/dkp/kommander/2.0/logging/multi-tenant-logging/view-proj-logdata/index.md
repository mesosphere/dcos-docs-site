---
layout: layout.pug
navigationTitle: View Project Log Data
title: View Project Log Data
menuWeight: 30
excerpt: How to view project log data within multi-tenant logging
beta: false
---

<!-- markdownlint-disable MD030 -->

You can only view the log data for a Project to which you have been granted access.

Run the following commands **on the attached cluster** to access the Project's Grafana UI:

1. Ensure to switch to the correct [context or Kubeconfig](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) of the attached cluster for the following kubectl commands.

1. Set the environment variables needed for the following procedure with the command:

   ``` bash
   export WORKSPACE_NAMESPACE=$(kubectl get workspace <type_your_workspace_name> -o jsonpath='{.status.namespaceRef.name}')
   export PROJECT_NAMESPACE=$(kubectl get project -n ${WORKSPACE_NAMESPACE} <type_your_project_name> -o jsonpath='{.status.namespaceRef.name}')
   ```

1. Get the Grafana URL:

   ```bash
   kubectl get ingress -n ${PROJECT_NAMESPACE} project-grafana-logging -o go-template='https://{{with index .status.loadBalancer.ingress 0}}{{or .hostname .ip}}{{end}}{{with index .spec.rules 0}}{{with index .http.paths 0}}{{.path }}{{end}}{{end}}{{"\n"}}'
   ```

To view logs in Grafana:

1. Go to the Explore tab:

   ```bash
   kubectl get ingress -n ${PROJECT_NAMESPACE} project-grafana-logging -o go-template='https://{{with index .status.loadBalancer.ingress 0}}{{or .hostname .ip}}{{end}}{{with index .spec.rules 0}}{{with index .http.paths 0}}{{.path }}{{end}}{{end}}/explore{{"\n"}}'
   ```

1.  You may be prompted to log in using the SSO flow. See [Kommander Security](../../../security/distributed-authnz/) for more information.

1. At the top of the page, change the datasource to `Loki`.

See the [Grafana Loki documentation](https://grafana.com/docs/grafana/v7.5/datasources/loki/) for more on how to use the interface to view and query logs.

![View Grafana Loki Logs](/dkp/kommander/2.0/img/lokiGrafanaLogs.gif)

<p class="message--important"><strong>IMPORTANT: </strong>Cert-Manager and Traefik must be deployed in the attached cluster to be able to access the Grafana UI. These are deployed by default on the workspace.</p>

You can [configure project policy][configure-project-ws-policy] to restrict access to the Project logging Grafana UI.

[configure-project-ws-policy]:/dkp/kommander/2.0/projects/project-policies/#configure-project-role-bindings-to-bind-to-workspaceroles-cli-method
