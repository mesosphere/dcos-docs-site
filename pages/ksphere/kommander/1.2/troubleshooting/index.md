---
layout: layout.pug
beta: true
title: Troubleshooting
navigationTitle: Troubleshooting
menuWeight: 11
excerpt: Troubleshooting common issues in Kommander UI
---

This section describes how you can use the `kubectl` CLI to debug unexpected behaviour in Kommander UI.

### I can't access the UI

If you log in to the UI via the `/ops/landing` page and you see a blank page with `Not authorized`, ensure that your user has been assigned appropriate `opsportal` and `kommander` ClusterRoles. See <a href="/ksphere/konvoy/1.5/security/external-idps/rbac/#portal-authorization">Konvoy RBAC Documentation</a> for a list of default roles. Users and groups configured by adding new Identity Providers must have these roles assigned manually.

If you log in to the UI and see a different error screen, ensure the Kommander deployment and pod is healthy by executing the following command:

`kubectl describe deployment -n kommander kommander-kubeaddons-kommander-ui`

### I can't access Kommander UI from Konvoy UI

If there is no link to Kommander in the sidebar of Konvoy UI and no Kommander item in the Apps header dropdown, ensure that Kommander has been installed on your cluster.

![Links to Kommander from Konvoy UI](/ksphere/kommander/1.2/img/kommander-links.png)

You can either check your `cluster.yaml` for an addon named `kommander` or you can check to see if your cluster has the Kommander ClusterAddon:

`kubectl get clusteraddon kommander`

### I can't see the workspace dropdown in the header or other global navigation links

If the UI you are looking at seems to be missing many of the Kommander navigation items from the sidebar and the workspace dropdown menu in the header, you may have navigated to Konvoy UI. The quickest way to check is to look at the name beside the logo in the left side of the header; it will say either **Konvoy** or **Kommander**.

![Konvoy UI](/ksphere/kommander/1.2/img/konvoy-ui.png)
Konvoy UI

![Kommander UI](/ksphere/kommander/1.2/img/kommander-ui.png)
Kommander UI

### I can't see the global dashboard in Kommander

If you are navigated directly to a workspace dashboard when you try to access Kommander UI and you cannot see **Global** in the workspace selection header dropdown, it is likely that your user does not have permission to access the global level of the UI. Execute this command:

`kubectl auth can-i list workspaces --as=<your user> --as-group=<your group if applicable>`

If the output of this command is `no`, your user does not have sufficient permissions to access the global UI.

### I can't see specific pages, buttons, or actions

If you cannot access a specific page, button, or action, it is likely that your user does not have sufficient permissions to interact with an underlying Kubernetes resource or resources. The following table lists some role-based access control restricted actions and pages, along with a `kubectl` command to check to see if your user has the minimum underlying permissions. Append `--as=<your user> --as-group=<your group if applicable>` to each command. The output of the `kubectl` command must be `yes`; a `no` is indicative of a lack of adequate permissions.

|                                     | Permissions Check                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Global: Access Control              | To see Roles, require one of:<br>- `kubectl auth can-i list federatedclusterroles` <br>- `kubectl auth can-i list clusterroles` <br>To see Policies, require one of: <br>- `kubectl auth can-i list virtualgroupkommanderclusterrolebindings` <br>- `kubectl auth can-i list virtualgroupclusterrolebindings`                                                                                                           |
| Global: Identity Providers          | To see Identity Providers: <br>- `kubectl auth can-i list connector.dex.mesosphere.io -n kubeaddons` <br>To see Groups: <br>- `kubectl auth can-i list virtualgroups`                                                                                                                                                                                                                                                   |
| Global: UI                          | `kubectl auth can-i list workspaces`                                                                                                                                                                                                                                                                                                                                                                                    |
| Create Cluster buttons              | One of: <br>- `kubectl auth can-i create konvoyclusters -n <workspace namespace>` <br>- `kubectl auth can-i create kommanderclusters -n <workspace namespace>`                                                                                                                                                                                                                                                          |
| Workspace: Projects                 | `kubectl auth can-i list projects -n <workspace namespace>`                                                                                                                                                                                                                                                                                                                                                             |
| Workspace: Access Control           | To see Roles, require one of: <br>- `kubectl auth can-i list workspaceroles -n <workspace namespace>` <br>- `kubectl auth can-i list kommanderworkspaceroles -n <workspace namespace` <br>To see Policies, require one of: <br>- `kubectl auth can-i list virtualgroupkommanderworkspacerolebindings -n <workspace namespace` <br>- `kubectl auth can-i list virtualgroupworkspacerolebindings -n <workspace namespace` |
| Workspace: Infrastructure Providers | `kubectl auth can-i list cloudprovideraccounts -n <workspace namespace`                                                                                                                                                                                                                                                                                                                                                 |

Similarly, to diagnose other missing actions for each resource listed above, the corresponding `update`, `delete`, and `create` permissions can be substituted in the place of `list` in the provided commands.
