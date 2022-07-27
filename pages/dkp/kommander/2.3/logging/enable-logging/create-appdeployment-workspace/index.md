---
layout: layout.pug
navigationTitle: Create AppDeployment for a Workspace
title: Create AppDeployments to Enable Workspace Logging
menuWeight: 10
excerpt: How to create AppDeployments to enable Workspace-level logging
beta: false
---

<!-- markdownlint-disable MD030 -->

Workspace logging AppDeployments enable and deploy the logging stack to all attached clusters within the workspace.
Use the DKP UI to enable the logging applications, or, alternately, use the CLI to create the AppDeployments.

To enable logging in DKP using the CLI, follow these steps on the **management** cluster:

1. Execute the following command to get the namespace of your workspace

   ```bash
   kubectl get workspaces
   ```

   And copy the value under `WORKSPACE NAMESPACE` column for your workspace. This may NOT be identical to the Display Name of the `Workspace`.

1. And then export the `WORKSPACE_NAMESPACE` variable:

   ```bash
   export WORKSPACE_NAMESPACE=<WORKSPACE_NAMESPACE>
   ```

1. Ensure that Cert-Manager and Traefik are enabled in the workspace. If you want to find if the applications are enabled on the management cluster workspace, you can run:

   ```bash
   kubectl get appdeployments -n ${WORKSPACE_NAMESPACE}
   ```

1. You can confirm that the applications are deployed on the **attached** cluster by running this `kubectl` command in that **attached** cluster:

   ```bash
   kubectl get helmreleases -n ${WORKSPACE_NAMESPACE}
   ```

1. Copy this command and execute it on the **management** cluster from a command line to create the Logging-operator, Grafana-loki, and Grafana-logging AppDeployments:

   ``` bash
   cat <<EOF | kubectl apply -f -
   apiVersion: apps.kommander.d2iq.io/v1alpha2
   kind: AppDeployment
   metadata:
     name: logging-operator
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: logging-operator-3.17.7
       kind: ClusterApp
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha2
   kind: AppDeployment
   metadata:
     name: fluent-bit
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: fluent-bit-0.19.20
       kind: ClusterApp
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha2
   kind: AppDeployment
   metadata:
     name: minio-operator
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: minio-operator-4.4.25
       kind: ClusterApp
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha2
   kind: AppDeployment
   metadata:
     name: grafana-loki
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: grafana-loki-0.48.4
       kind: ClusterApp
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha2
   kind: AppDeployment
   metadata:
     name: grafana-logging
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: grafana-logging-6.28.0
       kind: ClusterApp
     configOverrides:
       name: workspace-grafana-overrides-cm
   EOF
   ```

Then, you can [verify the cluster logging stack installation][verify-logging-install].

[verify-logging-install]: ../verify-cluster-logstack
