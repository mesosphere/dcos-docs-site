---
layout: layout.pug
navigationTitle: View Project Log Data
title: View Project Log Data
menuWeight: 30
excerpt: How to view project log data within multi-tenant logging
beta: false
---

You can only view the log data for a Project to which you have been granted access.

Run the following commands on the **management** cluster:

1.  Execute the following command to get the namespace of your workspace

    ```bash
    kubectl get workspaces
    ```

    Copy the value under `WORKSPACE NAMESPACE` column for your workspace. This may NOT be identical to the Display Name of the `Workspace`.

1.  Export the `WORKSPACE_NAMESPACE` variable:

    ```bash
    export WORKSPACE_NAMESPACE=<WORKSPACE_NAMESPACE>
    ```

1.  Execute the following command to get the namespace of your project

    ```bash
    kubectl get projects -n ${WORKSPACE_NAMESPACE}
    ```

    Copy the value under `PROJECT NAMESPACE` column for your project. This may NOT be identical to the Display Name of the `Project`.

1.  Export the `PROJECT_NAMESPACE` variable:

    ```bash
    export PROJECT_NAMESPACE=<PROJECT_NAMESPACE>
    ```

    Run the following commands **on the attached cluster** to access the Project's Grafana UI:

    Ensure you switched to the correct [context or kubeconfig](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) of the attached cluster for the following kubectl commands:

1.  Get the Grafana URL:

   ```bash
   kubectl get ingress -n ${PROJECT_NAMESPACE} ${PROJECT_NAMESPACE}-project-grafana-logging -o go-template='https://{{with index .status.loadBalancer.ingress 0}}{{or .hostname .ip}}{{end}}{{with index .spec.rules 0}}{{with index .http.paths 0}}{{.path }}{{end}}{{end}}{{"\n"}}'
   ```

To view logs in Grafana:

1.  Go to the `Explore` tab:

    ```bash
    kubectl get ingress -n ${PROJECT_NAMESPACE} ${PROJECT_NAMESPACE}-project-grafana-logging -o go-template='https://{{with index .status.loadBalancer.ingress 0}}{{or .hostname .ip}}{{end}}{{with index .spec.rules 0}}{{with index .http.paths 0}}{{.path }}{{end}}{{end}}/explore{{"\n"}}'
    ```

1.  You may be prompted to log in using the SSO flow. See [Kommander Security](../../../security/distributed-authnz/) for more information.

1.  At the top of the page, change the datasource to `Loki`.

See the [Grafana Loki documentation](https://grafana.com/docs/grafana/v7.5/datasources/loki/) for more on how to use the interface to view and query logs.

![View Grafana Loki Logs](/dkp/kommander/2.1/img/lokiGrafanaLogs.gif)

<p class="message--important"><strong>IMPORTANT: </strong>Cert-Manager and Traefik must be deployed in the attached cluster to be able to access the Grafana UI. These are deployed by default on the workspace.</p>

You can [configure workspace policy][configure-ws-policy] to restrict access to the Project logging Grafana UI.
Each Grafana instance in a Project has a unique URL at the cluster level. Consider creating a `WorkspaceRoleBinding` that maps to a `ClusterRoleBinding`, on attached cluster(s), for each Project level Grafana instance. For example, If you have a group named `sample-group` and two projects named `first-project` and `second-project` in `sample-workspace` workspace, then the Role Bindings look similar to the following:

![Project Grafana Workspace Role Binding](/dkp/kommander/2.1/img/add-project-grafana-role-binding.png)

Select the correct role bindings for each group for a project at the workspace level.

[configure-ws-policy]: ../../../workspaces/workspace-policies
