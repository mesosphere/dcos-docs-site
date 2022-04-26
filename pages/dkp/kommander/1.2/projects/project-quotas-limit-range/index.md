---
layout: layout.pug
beta: false
navigationTitle: Project Quotas & Limit Ranges
title: Project Quotas & Limit Ranges
menuWeight: 1
excerpt: Project Quotas and Limit Ranges can be set up to limit the amount of resources that can be used by the Project team.
---

Project Quotas and Limit Ranges can be set up to limit the amount of resources that can be used by the Project team. Quotas and Limit Ranges are applied to all project clusters. 

![Project Quotas and Limit Ranges](/dkp/kommander/1.2/img/project-quota.png)
Project Quotas and Limit Ranges

Kommander provides a set of default resources you can set Quotas for, or you can define Quotas for custom resources. It is recommended to set Quotas for CPU and Memory. Using Limit Ranges, you can restrict the resource consumption of individual Pods, Containers, and Persistent Volume Claims in the project namespace. You can also constrain memory and CPU resources consumed by Pods and Containers, and you can constrain storage resources consumed by Persistent Volume Claims.

![Adding a custom Quota](/dkp/kommander/1.2/img/project-quotas-add-custom.png)

All the Project Quotas are defined using a Kubernetes FederatedResourceQuota called kommander which can also be created/updated using kubectl:

```bash
cat << EOF | kubectl apply -f -
apiVersion: types.kubefed.io/v1beta1
kind: FederatedResourceQuota
metadata:
  name: kommander
  namespace: ${projectns}
spec:
  placement:
    clusterSelector: {}
  template:
    spec:
      hard:
        limits.cpu: "10"
        limits.memory: 1024.000Mi
EOF
```

Ensure the projectns variable is set before executing the command.

Then, if you run the following command on a Kubernetes cluster associated with the Project, you’ll see a Kubernetes Secret Object in the corresponding namespace:

```bash
$ kubectl -n ${projectns} get resourcequota kommander -o yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  creationTimestamp: "2020-06-05T08:04:37Z"
  labels:
    kubefed.io/managed: "true"
  name: kommander
  namespace: project1-5ljs9-lhvjl
  resourceVersion: "470822"
  selfLink: /api/v1/namespaces/project1-5ljs9-lhvjl/resourcequotas/kommander
  uid: 925b61b4-134b-4c45-915c-96a05b63d3c3
spec:
  hard:
    limits.cpu: "10"
    limits.memory: 1Gi
status:
  hard:
    limits.cpu: "10"
    limits.memory: 1Gi
  used:
    limits.cpu: "0"
    limits.memory: "0"
```

Similarly, Project Limit Ranges are defined using a FederatedLimitRange object with name `kommander` in the project namespace:

```bash
cat << EOF | kubectl apply -f -
apiVersion: types.kubefed.io/v1beta1
kind: FederatedLimitRange
metadata:
  name: kommander
  namespace: ${projectns}
spec:
  placement:
    clusterSelector: {}
  template:
    spec:
      limits:
      - type: "Pod"
        max:
          cpu: 500m
          memory: 50Gi
        min:
          cpu: 100m
          memory: 10Gi
      - type: "Container"
        max:
          cpu: 2
          memory: 100Mi
        min:
          cpu: 1
          memory: 10Mi
      - type: "PersistentVolumeClaim"
        max:
          storage: 3Gi
        min:
          storage: 1Gi
EOF
```
