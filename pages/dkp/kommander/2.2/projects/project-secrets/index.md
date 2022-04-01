---
layout: layout.pug
navigationTitle: Project Secrets
title: Project Secrets
menuWeight: 6
excerpt: Project Secrets can be created to make sure a Kubernetes Secrets are automatically created on all the Kubernetes clusters associated with the Project, in the corresponding namespace.
---

Project Secrets can be created to make sure Kubernetes Secrets are automatically created on all the Kubernetes clusters associated with the Project, in the corresponding namespace.

## Configuring  Project Secrets - UI Method

1. Select the workspace your project was created in from the workspace selection dropdown in the header.

1. In the sidebar menu select **Projects**, and then select the project you would like to configure from the table.

1. Select the **Secrets** tab, and then select the **Create Secret** button.

1. Complete the form and select the **Create** button.

## Configuring  Project Secrets - CLI Method

A Project Secret is simply a Kubernetes FederatedConfigSecret and can also be created using kubectl:

```bash
cat << EOF | kubectl create -f -
apiVersion: types.kubefed.io/v1beta1
kind: FederatedSecret
metadata:
  generateName: secret1-
  namespace: ${projectns}
spec:
  placement:
    clusterSelector: {}
  template:
    data:
      key: dmFsdWU=
EOF
```

Ensure the `projectns` variable is set before executing the command.

```bash
projectns=$(kubectl -n ${workspacens} get projects.workspaces.kommander.mesosphere.io -o jsonpath='{.items[?(@.metadata.generateName=="project1-")].status.namespaceRef.name}')
```

<p class="message--note"><strong>NOTE: </strong>The value of the key is base64 encoded.</p>

If you run the following command on a Kubernetes cluster associated with the Project, you see a Kubernetes Secret Object, in the corresponding namespace:

```bash
kubectl -n ${projectns} get secret secret1-r9vk2 -o yaml
apiVersion: v1
data:
  key: dmFsdWU=
kind: Secret
metadata:
  creationTimestamp: "2020-06-04T16:51:59Z"
  labels:
    kubefed.io/managed: "true"
  name: secret1-r9vk2
  namespace: project1-5ljs9-lhvjl
  resourceVersion: "137215"
  selfLink: /api/v1/namespaces/project1-5ljs9-lhvjl/secrets/secret1-r9vk2
  uid: e5c6fc1d-93e7-47fe-ae1e-f418f8e35d72
type: Opaque
```
