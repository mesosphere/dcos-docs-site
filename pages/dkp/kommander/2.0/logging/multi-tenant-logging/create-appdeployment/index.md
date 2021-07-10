---
layout: layout.pug
navigationTitle: Create Project-level AppDeployments
title: Create Project-level AppDeployments
menuWeight: 15
excerpt: How to create Project-level AppDeployments for use in multi-tenant logging
beta: true
---

<!-- markdownlint-disable MD030 -->

You must create AppDeployments in the Project namespace to enable and deploy the logging stack to all clusters within a Project.

To create the AppDeployment needed for Project-level logging, follow these steps **on the management cluster**:

1. Set the environment variables needed for this procedure with the command:

   ``` bash
   export WORKSPACE_NAMESPACE=$(kubectl get workspace <type_your_workspace_name> -o jsonpath='{.status.namespaceRef.name}')
   export PROJECT_NAMESPACE=$(kubectl get project -n ${WORKSPACE_NAMESPACE} <type_your_project_name> -o jsonpath='{.status.namespaceRef.name}')
   ```

1. Copy this command and execute it from a command line:

   ``` bash
   cat <<EOF | kubectl apply -f -
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: loki-distributed
     namespace: ${PROJECT_NAMESPACE}
   spec:
     appRef:
       name: loki-distributed-0.33.1
     configOverrides:
       name: project-loki-overrides-cm
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: grafana-logging
     namespace: ${PROJECT_NAMESPACE}
   spec:
     appRef:
       name: grafana-logging-6.9.1
     configOverrides:
       name: project-grafana-overrides-cm
   EOF
   ```
