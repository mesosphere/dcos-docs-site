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
Use the Kommander UI to enable the logging applications, or, alternately, use the CLI to create the AppDeployments.

To enable logging in DKP using the CLI, follow these steps on the management cluster:

1. Set the `WORKSPACE_NAMESPACE` environment variable needed for this procedure using the command to get the name of the workspace's namespace:

   ``` bash
   export WORKSPACE_NAMESPACE=$(kubectl get workspace <type_your_workspace_name> -o jsonpath='{.status.namespaceRef.name}')
   ```

1. Ensure that Cert-Manager and Traefik are enabled in the workspace.

1. Copy this command and execute it from a command line to create the Logging-operator, Grafana-loki, and Grafana-logging AppDeployments:

   ``` bash
   cat <<EOF | kubectl apply -f -
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: logging-operator
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: logging-operator-3.13.0
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: fluent-bit
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: fluent-bit-0.16.2
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: minio-operator
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: minio-operator-4.1.7
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: grafana-loki
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: grafana-loki-0.33.1
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: grafana-logging
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: grafana-logging-6.9.1
   EOF
   ```

Then, you can [verify the cluster logging stack installation][verify-logging-install].

[verify-logging-install]: ../verify-cluster-logstack
