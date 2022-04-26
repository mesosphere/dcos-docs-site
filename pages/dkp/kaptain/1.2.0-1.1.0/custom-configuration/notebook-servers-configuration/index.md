---
layout: layout.pug
navigationTitle: Notebook Servers Configuration
title: Configuring Notebook Servers
menuWeight: 70
excerpt: Configure Notebook Servers pre-defined controls and settings
beta: false
enterprise: false
---

Configure Notebook Servers controls and settings.

## Prerequisites

-   A Konvoy cluster `v1.7.0` or above.

## Creating custom Toleration Groups and Affinity Configurations

You can pre-configure node toleration groups and affinity configurations in the Notebook Servers UI.
These settings allow users to specify `tolerations` and `affinity` rules for the Notebook pods. 
This allows notebook-specific workloads to run on specific nodes from a pool of available resources.

For more information about the pod scheduling controls, please refer to the [official Kubernetes documentation](https://kubernetes.io/docs/concepts/scheduling-eviction/).

Toleration groups and affinity configs can be configured via `notebookTolerationGroups` and `notebookAffinityConfig` parameters respectively.

First, create a `parameters.yaml` file in the following format:
```yaml
notebookTolerationGroups:
  - groupKey: "notebooks"
    displayName: "Notebooks Node Group"
    tolerations:
      - key: "dedicated"
        operator: "Equal"
        value: "notebook"
        effect: "NoExecute"
notebookAffinityConfig:
  - configKey: "notebook-affinity-config"
    displayName: "Notebook Affinity Configuration" 
    affinity:
      nodeAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          nodeSelectorTerms:
          - matchExpressions:
            - key: topology.kubernetes.io/region
              operator: In
              values:
              - us-west-1
              - us-west-2
        preferredDuringSchedulingIgnoredDuringExecution:
        - weight: 1
          preference:
            matchExpressions:
            - key: another-node-label-key
              operator: In
              values:
              - another-node-label-value
```

You should set any other desired operator parameters in this file as well, so that you have a single file with all the operator configurations.
Please refer to the [Toleration v1 core](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core) 
and [Affinity v1 core](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core) 
pages in the Kubernetes API documentation to see all the supported fields.

Specify the parameters file as an argument to `kubectl kudo install` command during the installation:
```bash
kubectl kudo install \
    --instance kaptain \
    --namespace kubeflow \
    --create-namespace ./kubeflow-1.2.0_1.1.0.tgz \
    --parameter-file parameters.yaml
```

After the installation is complete, the newly added configuration should be available in the Notebook Servers UI:

![notebook-configs](../../img/notebook-configuration-tolerations-and-affinity.png)

Check a Notebook pod spec to verify the configuration has been applied to new Notebook server:
```bash
kubectl get pod -n <namespace> <pod name> -o yaml
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  ...
  name: jupyter-0
...
spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - preference:
          matchExpressions:
          - key: another-node-label-key
            operator: In
            values:
            - another-node-label-value
        weight: 1
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: topology.kubernetes.io/region
            operator: In
            values:
            - us-west-1
            - us-west-2
  ...
  tolerations:
  - effect: NoExecute
    key: dedicated
    operator: Equal
    value: notebook
  - effect: NoExecute
    key: node.kubernetes.io/not-ready
    operator: Exists
    tolerationSeconds: 300
  - effect: NoExecute
    key: node.kubernetes.io/unreachable
    operator: Exists
    tolerationSeconds: 300
  ...
```
