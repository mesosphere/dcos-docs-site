---
layout: layout.pug
navigationTitle: Create ConfigMap for Multi-Tenant Logging
title: Create a ConfigMap for Multi-Tenant Logging
menuWeight: 10
excerpt: How to create a ConfigMap for multi-tenant logging
beta: true
---

<!-- markdownlint-disable MD030 -->

Grafana and Loki both have their own configMaps for configuration. To enable logging properly, we need to override those configMaps to override the Grafana URL, so that it points instead to `/dkp/workspace/${WORKSPACE_NAMESPACE}/project/${PROJECT_NAMESPACE}/logging/grafana`.

We also want to override the default configuration so that the Logging facility sends logs to a specific Project namespace. To create the necessary configMaps for Project-level logging, follow these steps **on the management cluster**:

1. Set the environment variables needed for this procedure with the command:

   ``` bash
   export WORKSPACE_NAMESPACE=$(kubectl get workspace <type_your_workspace_name> -o jsonpath='{.status.namespaceRef.name}')
   export PROJECT_NAMESPACE=$(kubectl get project -n ${WORKSPACE_NAMESPACE} <type_your_project_name> -o jsonpath='{.status.namespaceRef.name}')
   export PROJECT_GRAFANA_PATH=/dkp/workspace/${WORKSPACE_NAMESPACE}/project/${PROJECT_NAMESPACE}/logging/grafana
   ```

1. Copy this command and execute it from a command line:

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
          path: ${PROJECT_GRAFANA_PATH}
          annotations:
            traefik.ingress.kubernetes.io/router.middlewares: "${WORKSPACE_NAMESPACE}-stripprefixes@kubernetescrd"
        grafana.ini:
          server:
            root_url: "%(protocol)s://%(domain)s:%(http_port)s${PROJECT_GRAFANA_PATH}"
        rbac:
          namespaced: true
   EOF
   ```

Then, you can [create project-level AppDeployments for use in multi-tenant logging][project-app-deployment].

[project-app-deployment]: ../create-appdeployment
