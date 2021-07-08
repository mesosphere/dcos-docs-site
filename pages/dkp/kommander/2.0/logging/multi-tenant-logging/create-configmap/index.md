---
layout: layout.pug
navigationTitle: Create ConfigMap for Multi-Tenant Logging
title: Create a ConfigMap for Multi-Tenant Logging
menuWeight: 10
excerpt: How to create a ConfigMap for multi-tenant logging
beta: true
---

<!-- markdownlint-disable MD030 -->

Grafana and Loki both have their own configMaps for configuration. To enable logging properly, we need to override those configMaps to override the Grafana URL, so that it points instead to `/dkp/kommander/dashboard/workspace/${WORKSPACE_NAMESPACE}/projects/${PROJECT_NAMESPACE}/logging/grafana`.

We also want to override the default configuration so that the Logging facility sends logs to a specific Project namespace. To create the necessary configMaps for Project-level logging, follow these steps on the management cluster:

1.  Set the environment variable needed for this procedure with the command:

   ``` bash
   export WORKSPACE_NAMESPACE=<type_your_workspace_namespace>
   export PROJECT_NAMESPACE=<type_your_project_namespace>
   export PROJECT_GRAFANA_URL=/dkp/kommander/dashboard/workspace/${WORKSPACE_NAMESPACE}/projects/${PROJECT_NAMESPACE}/logging/grafana
   ```

1.  Copy this command and execute it from a command line:

   ``` bash
   cat <<EOF | kubectl apply -f -
   ---
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: project-loki-overrides-cm
     namespace: ${PROJECT_NAMESPACE}
   data:
     values.yaml: |-
       ---
       ruler:
         enabled: false
   ---
   apiVersion: v1
   kind: ConfigMap
   metadata:
      name: project-grafana-overrides-cm
      namespace: ${PROJECT_NAMESPACE}
   data:
      values.yaml: |-
        ---
        ingress:
          path: ${PROJECT_GRAFANA_URL}
          annotations:
            traefik.ingress.kubernetes.io/router.middlewares: "${WORKSPACE_NAMESPACE}-stripprefixes@kubernetescrd"
        grafana.ini:
          server:
            root_url: "%(protocol)s://%(domain)s:%(http_port)s${PROJECT_GRAFANA_URL}"
        rbac:
          namespaced: true
   EOF
   ```
