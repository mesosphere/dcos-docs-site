---
layout: layout.pug
navigationTitle: Create ConfigMap for Workspace Logging
title: Create a ConfigMap for Workspace Logging
menuWeight: 10
excerpt: How to create a ConfigMap for workspace logging
beta: true
---

<!-- markdownlint-disable MD030 -->

Grafana and Loki both have their own configMaps for configuration. To enable logging properly, we need to override the Grafana configMap.

Run the following commands on the management cluster:

1.  Set the environment variable needed for this procedure with the command:

   ``` bash
   export PROJECT_NAMESPACE=<type_your_project_namespace>
   ```

1.  Copy this command and execute it from a command line:

   ``` bash
   cat <<EOF | kubectl apply -f -
   ---
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: workspace-grafana-overrides-cm
     namespace: ${PROJECT_NAMESPACE}
   data:
     values.yaml: |-
       ---
       ingress:
         annotations:
           traefik.ingress.kubernetes.io/router.middlewares: "${WORKSPACE_NAMESPACE}-stripprefixes@kubernetescrd"
   EOF
   ```
