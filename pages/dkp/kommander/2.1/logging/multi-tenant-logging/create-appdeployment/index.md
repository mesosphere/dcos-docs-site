---
layout: layout.pug
navigationTitle: Create Project-level logging AppDeployments
title: Create Project-level logging AppDeployments
menuWeight: 15
excerpt: How to create Project-level AppDeployments for use in multi-tenant logging
beta: false
---

<!-- markdownlint-disable MD030 -->

You must create AppDeployments in the Project namespace to enable and deploy the logging stack to all clusters within a Project. You can use the CLI to do this, or use the Kommander UI to enable the logging applications.

To create the AppDeployments needed for Project-level logging, follow these steps **on the management cluster**:

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
     name: project-grafana-loki
     namespace: ${PROJECT_NAMESPACE}
   spec:
     appRef:
       name: project-grafana-loki-0.33.1
   ---
   apiVersion: apps.kommander.d2iq.io/v1alpha1
   kind: AppDeployment
   metadata:
     name: project-grafana-logging
     namespace: ${PROJECT_NAMESPACE}
   spec:
     appRef:
       name: project-grafana-logging-6.13.9
   EOF
   ```

Then, you can [verify the project logging stack installation for multi-tenant logging][verify-project-logstack].

[verify-project-logstack]: ../verify-proj-logstack-install
