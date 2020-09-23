---
layout: layout.pug
navigationTitle: Project Quotas
title: Project Quotas
menuWeight: 1
excerpt: Project Quotas can be set up to limit the amount of resources that can be used by the Project team.
---

Project Quotas can be set up to limit the amount of resources that can be used by the Project team. Quotas are applied to all project clusters.

![Project Quota](/dkp/kommander/1.1/img/project-quota.png)
Project Quota

Kommander provides a set of default resources you can set Quotas for, or you can define Quotas for custom resources. It is recommended to set Quotas for CPU and Memory.

![Adding a custom Quota](/dkp/kommander/1.1/img/project-quotas-add-custom.png)

All the Project Quotas are defined using a Kubernetes FederatedResourceQuota called kommander and can also be created/updated using kubectl:

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

You need to make sure the projectns variable is set before executing the command.

Then, if you run the following command on a Kubernetes cluster associated with the Project, you’ll see a Kubernetes Secret Object, in the corresponding namespace:

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
