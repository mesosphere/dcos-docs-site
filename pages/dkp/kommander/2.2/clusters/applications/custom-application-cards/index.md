---
layout: layout.pug
navigationTitle: Custom Application Cards
title: Custom Cluster Application Cards
menuWeight: 10
excerpt: Define custom application cards displayed on a cluster's detail page.
---

## Custom Cluster Application Cards

Custom application cards can be added to the cluster detail page's Applications section by creating a `ConfigMap` on the cluster. The `ConfigMap` must have a `kommander.d2iq.io/application` label applied through the CLI and must contain both `name` and `dashboardLink` data keys to be displayed. Upon creation of the `ConfigMap`, the Kommander UI displays a card corresponding to the data provided in the `ConfigMap`. Custom application cards have a Kubernetes icon and can link to a service running in the cluster, or use an absolute URL to link to any accessible URL.

### ConfigMap example

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: "my-app"
  namespace: "app-namespace"
  labels:
    "kommander.d2iq.io/application": "my-app"
data:
  name: "My Application"
  dashboardLink: "/path/to/app"
```

| Key                                             | Description                                                                                                                                                                                                                                          | Required |
| :---------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------: |
| metadata.labels."kommander.d2iq.io/application" | The application name (ID).                                                                                                                                                                                                                           |    X     |
| data.name                                       | The display name that describes the application and displays on the custom application card in the user interface.                                                                                                                            |    X     |
| data.dashboardLink                              | The link to the application. This can be an absolute link, `https://www.d2iq.com` or a relative link, `/dkp/kommander/dashboard.` If you use a relative link, the link is built using the cluster's path as the base of the URL to the application. |    X     |
| data.docsLink                                   | Link to documentation about the application. This is displayed on the application card, but omitted if not present.                                                                                                                                  |          |
| data.category                                   | Category with which to group the custom application. If not provided, the application is grouped under the category, "None."                                                                                                                         |          |
| data.version                                    | A version string for the application. If not provided, "N/A" is displayed on the application card in the user interface.                                                                                                                             |          |

Use a command similar to this to create a new custom application `ConfigMap`:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: "my-app"
  namespace: "default"
  labels:
    "kommander.d2iq.io/application": "my-app"
data:
  name: "My Application"
  dashboardLink: "/path/to/app"
EOF
```
