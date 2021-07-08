---
layout: layout.pug
navigationTitle: View Cluster Log Data
title: View Cluster Log Data
menuWeight: 15
excerpt: How to View the cluster's log data after enabling logging
beta: true
---

Though you enable logging at the Workspace level, viewing the log data is done at the cluster level, using the cluster's Grafana logging URL. To view log data for an attached cluster in the Workspace, access the Grafana UI at `<CLUSTER_URL>/dkp/logging/grafana`.

To get the login username and password for Grafana, run the following commands on the attached cluster:

```bash
echo username: $(kubectl get secrets -n ${WORKSPACE_NAMESPACE} grafana-logging --template="{{index .data \"admin-user\" | base64decode }}{{println}}")
echo password: $(kubectl get secrets -n ${WORKSPACE_NAMESPACE} grafana-logging --template="{{index .data \"admin-password\" | base64decode }}{{println}}")
```

Use these values to log in to the Grafana UI.

To view logs in Grafana:

1.  Go to the Explore tab at `<CLUSTER_URL>/dkp/kommander/dashboard/workspace/${WORKSPACE_NAMESPACE}/projects/${PROJECT_NAMESPACE}/logging/grafana/explore`

1.  At the top of the page, change the datasource to `Loki`.

<p class="message--important"><strong>IMPORTANT BETA NOTE: </strong>You must deploy Cert-manager, Traefik, and traefik-forward-auth in the attached cluster to be able to access the Grafana UI. These are deployed during <a href="../../logging/enable-logging/create-appdeployment-workspace">AppDeployment creation</a>.</p>
