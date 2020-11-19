---
layout: layout.pug
beta: false
navigationTitle: Project Secrets
title: Project Secrets
menuWeight: 1
excerpt: Project Secrets can be created to make sure a Kubernetes Secrets are automatically created on all the Kubernetes clusters associated with the Project, in the corresponding namespace.
---

Project Secrets can be created to make sure a Kubernetes Secrets are automatically created on all the Kubernetes clusters associated with the Project, in the corresponding namespace.

A Project Secret can be created using the Kommander UI:

![Project Secret Form](/dkp/kommander/1.2/img/project-create-secret.png)
Project Secret Form

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

Ensure the projectns variable is set before executing the command.

**Note**: The value of the key is base64 encoded.

Then, if you run the following command on a Kubernetes cluster associated with the Project, you’ll see a Kubernetes Secret Object, in the corresponding namespace:

```bash
$ kubectl -n ${projectns} get secret secret1-r9vk2 -o yaml
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
