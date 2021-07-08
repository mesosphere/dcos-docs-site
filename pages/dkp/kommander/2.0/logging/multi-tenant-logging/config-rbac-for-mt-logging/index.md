---
layout: layout.pug
navigationTitle: Configure RBAC Values for Multi-Tenant Logging
title: Configure RBAC Values for Multi-Tenant Logging
menuWeight: 25
excerpt: How to configure RBAC values for multi-tenant logging
beta: true
---

<!-- markdownlint-disable MD030 -->

To limit access to a Project-level Grafana instance, you can create a WorkspaceRole in the host cluster workspace. This role is then federated into workspace clusters as a ClusterRole.

The code block that follows creates three templates offering three levels of ClusterRole:

-   admin access for management and control of the Grafana instance

-   write access for editing of visualizations

-   read access for viewing log data

To create the RBAC objects needed for Project-level logging, follow these steps on the management cluster:

1. Set the environment variables needed for this procedure.

   If you are following the [previously-created configMap](..//create-configmap) for configuring a Project Grafana instance, you can set PROJECT_GRAFANA_URL to `/dkp/kommander/dashboard/workspace/${WORKSPACE_NAMESPACE}/projects/${PROJECT_NAMESPACE}/logging/grafana`, being sure that the WORKSPACE_NAMESPACE and PROJECT_NAMESPACE environment variables are set.

   ``` bash
   export WORKSPACE_NAMESPACE=<type_your_workspace_namespace>
   export PROJECT_NAMESPACE=<type_your_project_namespace>
   export PROJECT_GRAFANA_URL=/dkp/kommander/dashboard/workspace/${WORKSPACE_NAMESPACE}/projects/${PROJECT_NAMESPACE}/logging/grafana
   ```

1.  Create a file to contain the RBAC objects using this command:

   ``` bash
    cat >logging_rbac.yaml
  ```

1.  Copy the following code block and add it to the file created in step 1, replacing the variables with values from your environment. Press Ctrl-D to save the file when you have completed your edits.

   ``` bash
   apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
   kind: WorkspaceRole
   metadata:
     annotations:
       kommander.mesosphere.io/description: This role grants admin permissions to downstream Grafana dashboard
       kommander.mesosphere.io/display-name: Workspace Grafana Admin Role
     name: project-dashboard-grafana-admin
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     rules:
     - nonResourceURLs:
       - ${PROJECT_GRAFANA_URL}
       - ${PROJECT_GRAFANA_URL}/*
       verbs:
       - '*'
   ---
   apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
   kind: WorkspaceRole
   metadata:
     annotations:
       kommander.mesosphere.io/description: This role grants edit permissions to downstream Grafana dashboard
       kommander.mesosphere.io/display-name: Workspace Grafana Edit Role
     generation: 1
     name: workspace-dashboard-grafana-edit
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     rules:
       - nonResourceURLs:
           - ${PROJECT_GRAFANA_URL}
           - ${PROJECT_GRAFANA_URL}/*
         verbs:
           - get
           - head
           - post
           - put
           - patch
   ---
   apiVersion: workspaces.kommander.mesosphere.io/v1alpha1
   kind: WorkspaceRole
   metadata:
     annotations:
       kommander.mesosphere.io/description: This role grants edit permissions to downstream Grafana dashboard
       kommander.mesosphere.io/display-name: Workspace Grafana View Role
     name: workspace-dashboard-grafana-view
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     rules:
       - nonResourceURLs:
           - ${PROJECT_GRAFANA_URL}
           - ${PROJECT_GRAFANA_URL}/*
         verbs:
           - get
           - head
   ```

1.  In the Project namespace on the managed cluster(s), copy the command in the code block that follows and execute it from a command line. The command creates a RoleBinding to reflect the usage for the role above..

   ``` bash
   cat <<EOF | kubectl apply -f -
   apiVersion: rbac.authorization.k8s.io/v1
   kind: RoleBinding
   metadata:
     name: view-grafana
     namespace: ${PROJECT_NAMESPACE}
   subjects:
   # You can specify more than one "subject" (ServiceAccounts, etc.)
   - kind: User
     name: jane
     apiGroup: rbac.authorization.k8s.io
   roleRef:
     kind: ClusterRole
     name: workspace-dashboard-grafana-view
     apiGroup: rbac.authorization.k8s.io
   EOF
   ```

In subsequent releases of Kommander, this entire process should be automated so that a user can configure the RoleBindings with ease.
