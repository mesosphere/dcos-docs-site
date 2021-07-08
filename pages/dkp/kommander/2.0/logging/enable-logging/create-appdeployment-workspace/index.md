---
layout: layout.pug
navigationTitle: Create AppDeployment for a Workspace
title: Create AppDeployments to Enable Workspace Logging
menuWeight: 5
excerpt: How to create AppDeployments to enable Workspace-level logging
beta: true
---

<!-- markdownlint-disable MD030 -->

Workspace logging AppDeployments enable and deploy the logging stack to all attached clusters within the workspace.

To enable logging in DKP, follow these steps on the management cluster:

1.  Set the environment variable needed for this procedure with the command:

   ``` bash
   export WORKSPACE_NAMESPACE=<type_your_workspace_namespace>
   ```

1.  Copy this command to create a cert-manager AppDeployment, and execute it from a command line:

   <p class="message--note"><strong>NOTE: </strong>Creating the cert-manager AppDeployment on a self-managed Konvoy cluster is unnecessary and will not work. If you are working with a self-managed Konvoy cluster, skip this step.</p>

   ``` bash
   cat <<EOF | kubectl apply -f -
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: cert-manager
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: cert-manager-0.2.7
   EOF
   ```

1.  Copy this command to create the Traefik and traefik-forward-auth AppDeployments, and execute it from a command line:

   ``` bash
   cat <<EOF | kubectl apply -f -
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: traefik
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: traefik-9.19.1
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: traefik-forward-auth
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: traefik-forward-auth-0.2.14
   EOF
   ```

1.  Copy this command to create the Logging-operator, Loki-distributed, and Grafana-logging AppDeployments, and execute it from a command line:

   ``` bash
   cat <<EOF | kubectl apply -f -
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: logging-operator
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: logging-operator-3.10.0
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: loki-distributed
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: loki-distributed-0.33.1
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: grafana-logging
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: grafana-logging-6.9.1
     configOverrides:
       name: workspace-grafana-overrides-cm
   EOF
   ```
