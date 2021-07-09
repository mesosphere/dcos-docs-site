---
layout: layout.pug
navigationTitle: Create Project-level Logging Configuration
title: Create Project-level Logging Configuration
menuWeight: 20
excerpt: How to create Project-level logging configurations for use in multi-tenant logging
beta: true
---

<!-- markdownlint-disable MD030 -->

Create these resources to direct pod logs to the Project namespace’s Loki server. To create the logging configuration for the Project, follow these steps on each of the attached clusters in the Project:

1. Set the environment variables needed for this procedure with the command:

   ``` bash
   export WORKSPACE_NAMESPACE=$(kubectl get workspace <type_your_workspace_name> -o jsonpath='{.status.namespaceRef.name}')
   export PROJECT_NAMESPACE=$(kubectl get project -n ${WORKSPACE_NAMESPACE} <type_your_project_name> -o jsonpath='{.status.namespaceRef.name}')
   ```

1. Copy this command and execute it from a command line:

   ``` bash
   cat <<EOF | kubectl apply -f -
   ---
   apiVersion: logging.banzaicloud.io/v1beta1
   kind: Flow
   metadata:
     name: flow
     namespace: ${PROJECT_NAMESPACE}
   spec:
     localOutputRefs:
     - loki
   ---
   apiVersion: logging.banzaicloud.io/v1beta1
   kind: Output
   metadata:
     name: loki
     namespace: ${PROJECT_NAMESPACE}
   spec:
     loki:
       url: http://loki-distributed-gateway.${PROJECT_NAMESPACE}.svc.cluster.local:80
       extract_kubernetes_labels: true
       configure_kubernetes_labels: true
   EOF
   ```

Then, you can [configure RBAC values for multi-tenant logging][configure-rbac].

[configure-rbac]: ../config-rbac-for-mt-logging
