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

   If you are following the [previously-created configMap](../create-configmap) for configuring a Project Grafana instance, you can set `${PROJECT_GRAFANA_PATH}` to `/dkp/workspace/${WORKSPACE_NAMESPACE}/project/${PROJECT_NAMESPACE}/logging/grafana`.

   ``` bash
   export WORKSPACE_NAMESPACE=$(kubectl get workspace <type_your_workspace_name> -o jsonpath='{.status.namespaceRef.name}')
   export PROJECT_NAMESPACE=$(kubectl get project -n ${WORKSPACE_NAMESPACE} <type_your_project_name> -o jsonpath='{.status.namespaceRef.name}')
   export PROJECT_GRAFANA_PATH=/dkp/workspace/${WORKSPACE_NAMESPACE}/project/${PROJECT_NAMESPACE}/logging/grafana
   ```

1. Execute the following command to create the three WorkspaceRoles:

   ``` bash
   cat <<EOF | kubectl apply -f -
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
       - ${PROJECT_GRAFANA_PATH}
       - ${PROJECT_GRAFANA_PATH}/*
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
           - ${PROJECT_GRAFANA_PATH}
           - ${PROJECT_GRAFANA_PATH}/*
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
           - ${PROJECT_GRAFANA_PATH}
           - ${PROJECT_GRAFANA_PATH}/*
         verbs:
           - get
           - head
   EOF
   ```

1. In the Project namespace on the **attached cluster**, copy the command in the code block that follows and execute it from a command line. The command creates a RoleBinding to reflect the usage for the role above.

   <p class="message--note"><strong>NOTE: </strong>You will want to change the <code>name</code>of the user from `jane` in the following snippet to an actual user for which you want to give access to the Project's Grafana dashboard.</p>

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

Then, you can [verify the project logging stack installation for multi-tenant logging][verify-project-logstack].

[verify-project-logstack]: ../verify-proj-logstack-install
