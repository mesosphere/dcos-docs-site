---
layout: layout.pug
navigationTitle: View Project Log Data
title: View Project Log Data
menuWeight: 30
excerpt: How to view project log data within multi-tenant logging
beta: true
---

You can only view the log data for a Project to which you have been granted access.

To view a Project's log data, access the Grafana UI on the attached cluster at `<CLUSTER_URL>/dkp/kommander/dashboard/workspace/${WORKSPACE_NAMESPACE}/projects/${PROJECT_NAMESPACE}/logging/grafana`.

To get the login username and password for Grafana, run the following commands on the attached cluster:

```bash
echo username: $(kubectl get secrets -n ${PROJECT_NAMESPACE} grafana-logging --template="{{index .data \"admin-user\" | base64decode }}{{println}}")
echo password: $(kubectl get secrets -n ${PROJECT_NAMESPACE} grafana-logging --template="{{index .data \"admin-password\" | base64decode }}{{println}}")
```

Use these values to log in to the Grafana UI.

To view logs in Grafana:

1.  Go to the Explore tab at `<CLUSTER_URL>/dkp/kommander/dashboard/workspace/${WORKSPACE_NAMESPACE}/projects/${PROJECT_NAMESPACE}/logging/grafana/explore`

1.  At the top of the page, change the datasource to `Loki`.

See the [Grafana Loki documentation](https://grafana.com/docs/grafana/v7.5/datasources/loki/) for more on how to use the interface to view and query logs.

<p class="message--important"><strong>IMPORTANT BETA NOTE: </strong>You must deploy Cert-manager, Traefik, and traefik-forward-auth in the attached cluster to be able to access the Grafana UI. These are deployed for you when the <a href="../../logging/enable-logging/create-appdeployment-workspace">Workspace AppDeployments</a> are created.</p>
