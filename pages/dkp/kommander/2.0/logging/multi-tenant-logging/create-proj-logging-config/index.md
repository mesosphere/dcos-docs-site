---
layout: layout.pug
navigationTitle: Create Project-level Logging Configuration
title: Create Project-level Logging Configuration
menuWeight: 20
excerpt: How to create Project-level logging configurations for use in multi-tenant logging
beta: true
---

<!-- markdownlint-disable MD030 -->

Create these resources to direct pod logs to the Project namespace’s Loki server. To create the logging configuration for the Project, follow these steps **on each of the attached clusters in the Project**:

1. Ensure to switch to the correct [context or Kubeconfig](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) of the attached cluster for the following kubectl commands.

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
       buffer:
         # Limit retries to prevent getting stuck on delivering logs out-of-order to Loki.
         # See https://github.com/banzaicloud/logging-operator/issues/674 and
         # https://github.com/fluent/fluent-bit/issues/2748.
         # fluentd uses exponential backoff when retrying logs. The retry limit should balance tolerance for
         # temporary loki unavailability with dropping out-of-order logs that can't be delivered.
         retry_forever: false
         retry_max_times: 5
   EOF
   ```

Then, you can [verify the project logging stack installation for multi-tenant logging][verify-project-logstack].

[verify-project-logstack]: ../verify-proj-logstack-install
