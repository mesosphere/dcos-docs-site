---
layout: layout.pug
navigationTitle: Project ConfigMaps
title: Project ConfigMaps
menuWeight: 1
excerpt: Project ConfigMaps can be created to make sure Kubernetes ConfigMaps are automatically created on all Kubernetes clusters associated with the Project, in the corresponding namespace.
---

Project ConfigMaps can be created to make sure Kubernetes ConfigMaps are automatically created on all Kubernetes clusters associated with the Project, in the corresponding namespace.

A Project ConfigMap can be created using the Kommander UI:

![Project ConfigMap Form](/ksphere/kommander/1.2/img/project-create-configmap.png)
Project ConfigMap Form

A Project ConfigMap is simply a Kubernetes FederatedConfigMap and can also be created using kubectl:

```bash
cat << EOF | kubectl create -f -
apiVersion: types.kubefed.io/v1beta1
kind: FederatedConfigMap
metadata:
  annotations:
    kommander.mesosphere.io/display-name: cm1
  generateName: cm1-
  namespace: ${projectns}
spec:
  placement:
    clusterSelector: {}
  template:
    data:
      key: value
EOF
```

You need to make sure the projectns variable is set before executing the command.

Then, if you run the following command on a Kubernetes cluster associated with the Project, you’ll see a Kubernetes ConfigMap Object, in the corresponding namespace:

```bash
$ kubectl -n ${projectns} get configmap cm1-8469c -o yaml
apiVersion: v1
data:
  key: value
kind: ConfigMap
metadata:
  creationTimestamp: "2020-06-04T16:37:10Z"
  labels:
    kubefed.io/managed: "true"
  name: cm1-8469c
  namespace: project1-5ljs9-lhvjl
  resourceVersion: "131844"
  selfLink: /api/v1/namespaces/project1-5ljs9-lhvjl/configmaps/cm1-8469c
  uid: d32acb98-3d57-421f-a677-016da5dab980
```
